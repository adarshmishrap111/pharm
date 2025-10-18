// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const admin = require('firebase-admin');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const Razorpay = require('razorpay');

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

// Razorpay Configuration
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_your_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'your_key_secret'
});

// Email Configuration (Gmail SMTP)
const emailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

// Helper function to send emails
async function sendEmail(to, subject, html) {
  try {
    await emailTransporter.sendMail({
      from: '"Pharmida Healthcare" <' + (process.env.EMAIL_USER || 'noreply@pharmida.com') + '>',
      to,
      subject,
      html
    });
    console.log('Email sent to:', to);
  } catch (err) {
    console.error('Email send error:', err.message);
  }
}

// Initialize environment variables
dotenv.config();

// Initialize Firebase Admin SDK (use env var or local file)
let firestoreDb = null;
try {
  // Prefer JSON from environment for production (set FIREBASE_ADMIN_JSON)
  const serviceAccount = process.env.FIREBASE_ADMIN_JSON
    ? JSON.parse(process.env.FIREBASE_ADMIN_JSON)
    : require('./firebase-adminsdk.json');

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'pharmida-healthcare.appspot.com',
  });

  firestoreDb = admin.firestore();
  console.log('✅ Firebase Admin initialized');
} catch (err) {
  // Not fatal for local dev - server will still run using SQLite fallbacks
  console.warn('⚠️ Firebase Admin not initialized:', err && err.message ? err.message : err);
}
const app = express();
const PORT = process.env.PORT || 3000; // Changed to 3000 for local development

// CORS Configuration for Frontend Domain
const corsOptions = {
  origin: [
    'https://www.pharmidahealthcare.com',
    'https://pharmidahealthcare.com',
    'http://localhost:3000',
    'http://127.0.0.1:3000'
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-secret', 'x-admin-token']
};

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());

// Redirect root domain (non-www) to www
app.use((req, res, next) => {
  if (req.hostname === "pharmidahealthcare.com") {
    return res.redirect(301, "https://www.pharmidahealthcare.com" + req.url);
  }
  next();
});

// CORS configuration for production domain
app.use(cors({
  origin: [
    'https://www.pharmidahealthcare.com',
    'https://pharmidahealthcare.com',
    'http://localhost:3000'  // for local development
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (your frontend) and uploaded images
app.use(express.static(path.join(__dirname)));
app.use('/uploads', express.static(path.join(__dirname, 'assets', 'uploads')));

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'assets', 'uploads');

async function ensureUploadsDir() {
  try {
    await fs.mkdir(uploadsDir, { recursive: true });
  } catch (err) {
    console.error('Error creating uploads dir', err);
  }
}
ensureUploadsDir();

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/[^a-z0-9\-]/gi, '_');
    const name = `${base}-${Date.now()}${ext}`;
    cb(null, name);
  }
});
// Multer with validation: limit file size and allowed mime types
const upload = multer({ 
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
  fileFilter: function (req, file, cb) {
    const allowed = ['image/jpeg','image/png','image/webp','image/gif','image/svg+xml'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Invalid file type'));
  }
});

// Multer for prescriptions (larger files, allows PDFs)
const prescriptionUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: function (req, file, cb) {
    const allowed = ['image/jpeg','image/png','image/webp','image/gif','application/pdf'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Invalid file type'));
  }
});

// Simple in-memory rate limiter for login endpoint (IP-based)
const loginAttempts = {}; // { ip: { count, first, blockedUntil } }
function loginRateLimiter(req, res, next) {
  const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 10 * 60 * 1000; // 10 minutes
  const maxAttempts = 5;
  const blockMs = 30 * 60 * 1000; // 30 minutes
  let entry = loginAttempts[ip];
  if (!entry) entry = loginAttempts[ip] = { count: 0, first: now, blockedUntil: 0 };
  if (entry.blockedUntil && now < entry.blockedUntil) {
    return res.status(429).json({ error: 'Too many attempts. Try later.' });
  }
  if (now - entry.first > windowMs) {
    entry.count = 0; entry.first = now; entry.blockedUntil = 0;
  }
  entry.count += 1;
  if (entry.count > maxAttempts) {
    entry.blockedUntil = now + blockMs;
    return res.status(429).json({ error: 'Too many attempts. Try later.' });
  }
  next();
}

const DB_FILE = path.join(__dirname, 'data.sqlite');
let db;

async function initDb() {
  await fs.mkdir(path.join(__dirname), { recursive: true });
  db = await open({ filename: DB_FILE, driver: sqlite3.Database });
  await db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      description TEXT,
      imageUrl TEXT,
      createdAt TEXT
    );
  `);
  // Ensure discount column exists
  try {
    const cols = await db.all("PRAGMA table_info(products);");
    const hasDiscount = cols.some(c => c.name === 'discount');
    if (!hasDiscount) {
      await db.exec('ALTER TABLE products ADD COLUMN discount TEXT;');
    }
  } catch (err) {
    console.error('Error ensuring discount column', err);
  }
  // ensure carts and orders tables
  try {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS carts (
        id TEXT PRIMARY KEY,
        items TEXT,
        createdAt TEXT
      );
    `);
        await db.exec(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cartId TEXT,
        items TEXT,
        total REAL,
        status TEXT DEFAULT 'pending',
        createdAt TEXT
      );
    `);
    // Add status column if not exists
    try {
      const orderCols = await db.all("PRAGMA table_info(orders);");
      const hasStatus = orderCols.some(c => c.name === 'status');
      if (!hasStatus) {
        await db.exec('ALTER TABLE orders ADD COLUMN status TEXT DEFAULT \'pending\';');
      }
    } catch (err) {
      console.error('Error ensuring status column', err);
    }
        // sessions table for admin login tokens
    await db.exec(`
      CREATE TABLE IF NOT EXISTS sessions (
        token TEXT PRIMARY KEY,
        createdAt TEXT,
        expiresAt TEXT
      );
    `);
    // user profiles table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS profiles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        address TEXT,
        createdAt TEXT
      );
    `);
    // prescriptions table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS prescriptions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        fileUrl TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        notes TEXT,
        createdAt TEXT
      );
    `);
    // ambulance requests table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS ambulance_requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        address TEXT NOT NULL,
        emergency TEXT,
        status TEXT DEFAULT 'pending',
        createdAt TEXT
      );
    `);
        // doctor appointments table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS doctor_appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        issue TEXT,
        preferredTime TEXT,
        status TEXT DEFAULT 'pending',
        createdAt TEXT
      );
    `);
    // users table for authentication
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        password TEXT NOT NULL,
        createdAt TEXT
      );
    `);
    // payments table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        orderId INTEGER,
        razorpayOrderId TEXT,
        razorpayPaymentId TEXT,
        amount REAL,
        status TEXT,
        method TEXT,
        createdAt TEXT
      );
    `);
  } catch (err) { console.error('Error ensuring carts/orders tables', err); }
}
initDb().catch(err => console.error('DB init error', err));

// Simple health route
app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'Pharm backend running' });
});

// Create product
// Protected create product endpoint: requires admin session
app.post('/api/products', requireAdmin, upload.single('productImage'), async (req, res) => {
  try {
    const { productName, price, description, discount } = req.body;
    if (!productName || !price || !description) {
      if (req.file) await fs.unlink(req.file.path).catch(() => {});
      return res.status(400).json({ error: 'productName, price and description are required' });
    }
    if (!req.file) return res.status(400).json({ error: 'productImage is required' });

    const imageUrl = `/uploads/${req.file.filename}`;
    const createdAt = new Date().toISOString();
    const result = await db.run(
      'INSERT INTO products (name, price, description, imageUrl, createdAt, discount) VALUES (?, ?, ?, ?, ?, ?)',
      productName, Number(price), description, imageUrl, createdAt, discount || null
    );
    const product = {
      id: result.lastID,
      name: productName,
      price: Number(price),
      description,
      imageUrl,
      createdAt,
      discount: discount || null
    };
    broadcastEvent({ type: 'product_added', product });
    res.json({ ok: true, product });
  } catch (err) {
    // multer file type/size errors may come here
    console.error('Create product error', err && err.message ? err.message : err);
    if (err && err.message && (err.message.includes('Invalid file type') || err.message.includes('File too large'))) {
      if (req.file) await fs.unlink(req.file.path).catch(() => {});
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// SSE: simple event stream for product changes
const sseClients = [];
function broadcastEvent(obj) {
  const data = `data: ${JSON.stringify(obj)}\n\n`;
  sseClients.forEach(res => {
    try { res.write(data); } catch (e) { /* ignore */ }
  });
}

app.get('/events', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive'
  });
  res.write('\n');
  sseClients.push(res);
  req.on('close', () => {
    const idx = sseClients.indexOf(res);
    if (idx !== -1) sseClients.splice(idx, 1);
  });
});

// List products (simple endpoint)
app.get('/api/products', async (req, res) => {
  try {
    const rows = await db.all('SELECT * FROM products ORDER BY id ASC');
    res.json({ ok: true, products: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Simple server-side cart endpoints
app.post('/api/cart', async (req, res) => {
  try {
    const { cartId, items } = req.body;
    if (!cartId || !items) return res.status(400).json({ error: 'cartId and items required' });
    const now = new Date().toISOString();
    await db.run('INSERT OR REPLACE INTO carts (id, items, createdAt) VALUES (?, ?, ?)', cartId, JSON.stringify(items), now);
    res.json({ ok: true });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Internal server error' }); }
});

app.get('/api/cart/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const row = await db.get('SELECT * FROM carts WHERE id = ?', id);
    if (!row) return res.json({ ok: true, items: [] });
    res.json({ ok: true, items: JSON.parse(row.items || '[]') });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Internal server error' }); }
});

// Checkout: converts cart into an order
app.post('/api/checkout', async (req, res) => {
  try {
    const { cartId } = req.body;
    if (!cartId) return res.status(400).json({ error: 'cartId required' });
    const row = await db.get('SELECT * FROM carts WHERE id = ?', cartId);
    const items = row ? JSON.parse(row.items || '[]') : [];
    const total = items.reduce((s, it) => s + (Number(it.price)||0), 0);
    const now = new Date().toISOString();
    const result = await db.run('INSERT INTO orders (cartId, items, total, createdAt) VALUES (?, ?, ?, ?)', cartId, JSON.stringify(items), total, now);
    // Optionally clear cart
    await db.run('DELETE FROM carts WHERE id = ?', cartId);
    res.json({ ok: true, orderId: result.lastID });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Internal server error' }); }
});

// Update product (supports metadata and optional new image via multipart)
// simple admin auth middleware for modifying endpoints
function requireAdmin(req, res, next) {
  const secret = process.env.ADMIN_PASSWORD || 'admin123';
  // allow static secret via header/param for backwards compatibility
  const got = req.headers['x-admin-secret'] || req.body.adminSecret || req.query.adminSecret;
  if (got && got === secret) return next();
  // check cookie-based session token
  const token = req.cookies && req.cookies.admin_token || req.headers['x-admin-token'];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  // validate token exists and not expired
  (async () => {
    try {
      const row = await db.get('SELECT * FROM sessions WHERE token = ?', token);
      if (!row) return res.status(401).json({ error: 'Unauthorized' });
      const now = new Date().toISOString();
      if (row.expiresAt && row.expiresAt < now) {
        // expired, remove
        await db.run('DELETE FROM sessions WHERE token = ?', token);
        return res.status(401).json({ error: 'Session expired' });
      }
      return next();
    } catch (err) {
      console.error('Session check error', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  })();
}

// cookie parser middleware light-weight: parse cookies into req.cookies
app.use((req, res, next) => {
  const header = req.headers.cookie || '';
  const obj = {};
  header.split(/;\s*/).forEach(pair => {
    if (!pair) return;
    const idx = pair.indexOf('=');
    if (idx === -1) return;
    const key = pair.substring(0, idx).trim();
    const val = decodeURIComponent(pair.substring(idx + 1));
    obj[key] = val;
  });
  req.cookies = obj;
  next();
});

// helper: create session token
async function createSession(ttlHours = 12) {
  const token = crypto.randomBytes(24).toString('hex');
  const now = new Date();
  const expires = new Date(now.getTime() + ttlHours * 60 * 60 * 1000);
  await db.run('INSERT INTO sessions (token, createdAt, expiresAt) VALUES (?, ?, ?)', token, now.toISOString(), expires.toISOString());
  return { token, expiresAt: expires.toISOString() };
}

// login endpoint: accepts JSON { password }
app.post('/api/login', async (req, res) => {
  try {
    const { password } = req.body;
    const secret = process.env.ADMIN_PASSWORD || 'admin123';
    if (!password || password !== secret) return res.status(401).json({ error: 'Invalid credentials' });
    const sess = await createSession(12);
    // set HttpOnly cookie
    res.setHeader('Set-Cookie', `admin_token=${sess.token}; HttpOnly; Path=/; Max-Age=${12 * 60 * 60}`);
    res.json({ ok: true });
  } catch (err) {
    console.error('Login error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// logout: clears token cookie and removes session
app.post('/api/logout', async (req, res) => {
  try {
    const token = req.cookies && req.cookies.admin_token;
    if (token) await db.run('DELETE FROM sessions WHERE token = ?', token).catch(() => {});
    // clear cookie
    res.setHeader('Set-Cookie', 'admin_token=; HttpOnly; Path=/; Max-Age=0');
    res.json({ ok: true });
  } catch (err) {
    console.error('Logout error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// session check: returns ok if admin session valid (or static secret provided)
app.get('/api/session', async (req, res) => {
  try {
    const secret = process.env.ADMIN_PASSWORD || 'admin123';
    const got = req.headers['x-admin-secret'] || req.query.adminSecret;
    if (got && got === secret) return res.json({ ok: true, admin: true });
    const token = req.cookies && req.cookies.admin_token;
    if (!token) return res.status(401).json({ ok: false, admin: false });
    const row = await db.get('SELECT * FROM sessions WHERE token = ?', token);
    if (!row) return res.status(401).json({ ok: false, admin: false });
    const now = new Date().toISOString();
    if (row.expiresAt && row.expiresAt < now) {
      await db.run('DELETE FROM sessions WHERE token = ?', token).catch(() => {});
      return res.status(401).json({ ok: false, admin: false, error: 'expired' });
    }
    return res.json({ ok: true, admin: true });
  } catch (err) {
    console.error('Session check error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/products/:id', requireAdmin, upload.single('productImage'), async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, price, description, discount } = req.body;
    const product = await db.get('SELECT * FROM products WHERE id = ?', id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    let imageUrl = product.imageUrl;
    if (req.file) {
      // remove old file
      const oldPath = path.join(__dirname, product.imageUrl || '');
      if (product.imageUrl) await fs.unlink(oldPath).catch(() => {});
      imageUrl = `/uploads/${req.file.filename}`;
    }

    await db.run('UPDATE products SET name=?, price=?, description=?, imageUrl=?, discount=? WHERE id=?',
      name || product.name, price ? Number(price) : product.price, description || product.description, imageUrl, discount || product.discount, id);
    const updated = await db.get('SELECT * FROM products WHERE id = ?', id);
    broadcastEvent({ type: 'product_updated', product: updated });
    res.json({ ok: true, product: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete product
app.delete('/api/products/:id', requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const product = await db.get('SELECT * FROM products WHERE id = ?', id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    if (product.imageUrl) {
      const filePath = path.join(__dirname, product.imageUrl);
      await fs.unlink(filePath).catch(() => {});
    }
    await db.run('DELETE FROM products WHERE id = ?', id);
    broadcastEvent({ type: 'product_deleted', id });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============= USER PROFILE ENDPOINTS =============

// Create or Update Profile
app.post('/api/profile', async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    if (!name || !email) return res.status(400).json({ error: 'Name and email required' });
    
    const existing = await db.get('SELECT * FROM profiles WHERE email = ?', email);
    const now = new Date().toISOString();
    
    if (existing) {
      // Update
      await db.run('UPDATE profiles SET name=?, phone=?, address=? WHERE email=?', name, phone, address, email);
      const updated = await db.get('SELECT * FROM profiles WHERE email = ?', email);
      res.json({ ok: true, profile: updated });
    } else {
      // Create
      const result = await db.run(
        'INSERT INTO profiles (name, email, phone, address, createdAt) VALUES (?, ?, ?, ?, ?)',
        name, email, phone, address, now
      );
      const profile = await db.get('SELECT * FROM profiles WHERE id = ?', result.lastID);
      res.json({ ok: true, profile });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Profile by Email
app.get('/api/profile/:email', async (req, res) => {
  try {
    const profile = await db.get('SELECT * FROM profiles WHERE email = ?', req.params.email);
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    res.json({ ok: true, profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get All Profiles (Admin)
app.get('/api/profiles', requireAdmin, async (req, res) => {
  try {
    const profiles = await db.all('SELECT * FROM profiles ORDER BY createdAt DESC');
    res.json({ ok: true, profiles });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============= PRESCRIPTION ENDPOINTS =============

// Upload Prescription
app.post('/api/prescriptions', prescriptionUpload.single('prescription'), async (req, res) => {
  try {
    const { userId, notes } = req.body;
    if (!req.file) return res.status(400).json({ error: 'Prescription file required' });
    
    const fileUrl = `/uploads/${req.file.filename}`;
    const now = new Date().toISOString();
    const result = await db.run(
      'INSERT INTO prescriptions (userId, fileUrl, notes, status, createdAt) VALUES (?, ?, ?, ?, ?)',
      userId || null, fileUrl, notes || null, 'pending', now
    );
    const prescription = await db.get('SELECT * FROM prescriptions WHERE id = ?', result.lastID);
    res.json({ ok: true, prescription });
  } catch (err) {
    console.error(err);
    if (req.file) await fs.unlink(req.file.path).catch(() => {});
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get All Prescriptions (Admin)
app.get('/api/prescriptions', requireAdmin, async (req, res) => {
  try {
    const prescriptions = await db.all('SELECT * FROM prescriptions ORDER BY createdAt DESC');
    res.json({ ok: true, prescriptions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update Prescription Status (Admin)
app.put('/api/prescriptions/:id', requireAdmin, async (req, res) => {
  try {
    const { status, notes } = req.body;
    await db.run('UPDATE prescriptions SET status=?, notes=? WHERE id=?', status, notes, req.params.id);
    const prescription = await db.get('SELECT * FROM prescriptions WHERE id = ?', req.params.id);
    res.json({ ok: true, prescription });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// AI Scan Prescription (Mock AI)
app.post('/api/prescriptions/scan', prescriptionUpload.single('scan'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Scan file required' });
    
    const fileUrl = `/uploads/${req.file.filename}`;
    const now = new Date().toISOString();
    
    // Mock AI analysis
    const aiResult = {
      medicines: ['Paracetamol 500mg', 'Azithromycin 250mg'],
      dosage: '2 times daily for 5 days',
      confidence: '92%'
    };
    
    const result = await db.run(
      'INSERT INTO prescriptions (fileUrl, notes, status, createdAt) VALUES (?, ?, ?, ?)',
      fileUrl, JSON.stringify(aiResult), 'scanned', now
    );
    const prescription = await db.get('SELECT * FROM prescriptions WHERE id = ?', result.lastID);
    res.json({ ok: true, prescription, aiResult });
  } catch (err) {
    console.error(err);
    if (req.file) await fs.unlink(req.file.path).catch(() => {});
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============= AMBULANCE REQUEST ENDPOINTS =============

// Create Ambulance Request
app.post('/api/ambulance', async (req, res) => {
  try {
    const { name, phone, address, emergency } = req.body;
    if (!name || !phone || !address) return res.status(400).json({ error: 'Name, phone and address required' });
    
    const now = new Date().toISOString();
    const result = await db.run(
      'INSERT INTO ambulance_requests (name, phone, address, emergency, status, createdAt) VALUES (?, ?, ?, ?, ?, ?)',
      name, phone, address, emergency || 'General emergency', 'pending', now
    );
    const request = await db.get('SELECT * FROM ambulance_requests WHERE id = ?', result.lastID);
    res.json({ ok: true, request });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get All Ambulance Requests (Admin)
app.get('/api/ambulance', requireAdmin, async (req, res) => {
  try {
    const requests = await db.all('SELECT * FROM ambulance_requests ORDER BY createdAt DESC');
    res.json({ ok: true, requests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update Ambulance Request Status (Admin)
app.put('/api/ambulance/:id', requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    await db.run('UPDATE ambulance_requests SET status=? WHERE id=?', status, req.params.id);
    const request = await db.get('SELECT * FROM ambulance_requests WHERE id = ?', req.params.id);
    res.json({ ok: true, request });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============= DOCTOR APPOINTMENT ENDPOINTS =============

// Create Doctor Appointment
app.post('/api/doctor', async (req, res) => {
  try {
    const { name, phone, issue, preferredTime } = req.body;
    if (!name || !phone) return res.status(400).json({ error: 'Name and phone required' });
    
    const now = new Date().toISOString();
    const result = await db.run(
      'INSERT INTO doctor_appointments (name, phone, issue, preferredTime, status, createdAt) VALUES (?, ?, ?, ?, ?, ?)',
      name, phone, issue || 'General consultation', preferredTime || 'ASAP', 'pending', now
    );
    const appointment = await db.get('SELECT * FROM doctor_appointments WHERE id = ?', result.lastID);
    res.json({ ok: true, appointment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get All Doctor Appointments (Admin)
app.get('/api/doctor', requireAdmin, async (req, res) => {
  try {
    const appointments = await db.all('SELECT * FROM doctor_appointments ORDER BY createdAt DESC');
    res.json({ ok: true, appointments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update Doctor Appointment Status (Admin)
app.put('/api/doctor/:id', requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    await db.run('UPDATE doctor_appointments SET status=? WHERE id=?', status, req.params.id);
    const appointment = await db.get('SELECT * FROM doctor_appointments WHERE id = ?', req.params.id);
    res.json({ ok: true, appointment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============= ORDER MANAGEMENT (Admin) =============

// Get All Orders (Admin)
app.get('/api/orders', requireAdmin, async (req, res) => {
  try {
    const orders = await db.all('SELECT * FROM orders ORDER BY createdAt DESC');
    res.json({ ok: true, orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Single Order (Public - for tracking)
app.get('/api/orders/:id', async (req, res) => {
  try {
    const order = await db.get('SELECT * FROM orders WHERE id = ?', req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ ok: true, order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update Order Status (Admin)
app.put('/api/orders/:id', requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: 'Status required' });
    
    await db.run('UPDATE orders SET status = ? WHERE id = ?', status, req.params.id);
    const order = await db.get('SELECT * FROM orders WHERE id = ?', req.params.id);
    res.json({ ok: true, order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============= USER AUTHENTICATION ENDPOINTS =============

// User Registration
app.post('/api/user/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password required' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    
    // Check if user exists
    const existing = await db.get('SELECT * FROM users WHERE email = ?', email);
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const now = new Date().toISOString();
    
    // Create user
    const result = await db.run(
      'INSERT INTO users (name, email, phone, password, createdAt) VALUES (?, ?, ?, ?, ?)',
      name, email, phone, hashedPassword, now
    );
    
    const user = await db.get('SELECT id, name, email, phone, createdAt FROM users WHERE id = ?', result.lastID);
    
    // Send welcome email
    sendEmail(
      email,
      'Welcome to Pharmida Healthcare',
      `<h2>Welcome ${name}!</h2><p>Your account has been created successfully.</p><p>Start shopping for quality healthcare products.</p>`
    );
    
    res.json({ ok: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User Login
app.post('/api/user/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    // Find user
    const user = await db.get('SELECT * FROM users WHERE email = ?', email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Set cookie
    res.setHeader('Set-Cookie', `user_token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}`);
    
    // Return user (without password)
    const { password: _, ...userWithoutPassword } = user;
    res.json({ ok: true, user: userWithoutPassword, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User Logout
app.post('/api/user/logout', (req, res) => {
  res.setHeader('Set-Cookie', 'user_token=; HttpOnly; Path=/; Max-Age=0');
  res.json({ ok: true });
});

// Get Current User
app.get('/api/user/me', async (req, res) => {
  try {
    const token = req.cookies && req.cookies.user_token;
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await db.get('SELECT id, name, email, phone, createdAt FROM users WHERE id = ?', decoded.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ ok: true, user });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// ============= PAYMENT GATEWAY ENDPOINTS =============

// Create Razorpay Order
app.post('/api/payment/create-order', async (req, res) => {
  try {
    const { amount, cartId } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }
    
    const options = {
      amount: Math.round(amount * 100), // Amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1
    };
    
    const order = await razorpay.orders.create(options);
    
    res.json({
      ok: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID || 'rzp_test_your_key_id',
      cartId
    });
  } catch (err) {
    console.error('Razorpay order creation error:', err);
    res.status(500).json({ error: 'Payment initialization failed' });
  }
});

// Verify Razorpay Payment
app.post('/api/payment/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, cartId } = req.body;
    
    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'your_key_secret')
      .update(body)
      .digest('hex');
    
    const isValid = expectedSignature === razorpay_signature;
    
    if (!isValid) {
      return res.status(400).json({ error: 'Payment verification failed' });
    }
    
    // Get cart items and create order
    const cart = await db.get('SELECT * FROM carts WHERE id = ?', cartId);
    const items = cart ? JSON.parse(cart.items || '[]') : [];
    const total = items.reduce((s, it) => s + (Number(it.price) || 0), 0);
    const now = new Date().toISOString();
    
    const orderResult = await db.run(
      'INSERT INTO orders (cartId, items, total, createdAt) VALUES (?, ?, ?, ?)',
      cartId, JSON.stringify(items), total, now
    );
    
    // Save payment record
    await db.run(
      'INSERT INTO payments (orderId, razorpayOrderId, razorpayPaymentId, amount, status, method, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
      orderResult.lastID, razorpay_order_id, razorpay_payment_id, total, 'success', 'razorpay', now
    );
    
    // Clear cart
    await db.run('DELETE FROM carts WHERE id = ?', cartId);
    
    // Send confirmation email
    const userEmail = localStorage.getItem('user_email') || '';
    if (userEmail) {
      sendEmail(
        userEmail,
        'Order Confirmation - Pharmida Healthcare',
        `<h2>Order Confirmed!</h2><p>Your order #${orderResult.lastID} has been placed successfully.</p><p><strong>Amount:</strong> ₹${total.toFixed(2)}</p><p>We'll deliver it within 2-3 business days.</p>`
      );
    }
    
    res.json({ ok: true, orderId: orderResult.lastID, paymentId: razorpay_payment_id });
  } catch (err) {
    console.error('Payment verification error:', err);
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

// Get Payment History (Admin)
app.get('/api/payments', requireAdmin, async (req, res) => {
  try {
    const payments = await db.all('SELECT * FROM payments ORDER BY createdAt DESC');
    res.json({ ok: true, payments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Force HTTPS (for Render)
app.use((req, res, next) => {
  if (req.headers["x-forwarded-proto"] !== "https") {
    return res.redirect("https://" + req.headers.host + req.url);
  }
  next();
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
  console.log('✅ User Authentication: Enabled');
  console.log('✅ Payment Gateway: Razorpay');
  console.log('✅ Email Notifications: Configured');
  console.log('\n⚠️  Remember to set environment variables:');
  console.log('   - RAZORPAY_KEY_ID');
  console.log('   - RAZORPAY_KEY_SECRET');
  console.log('   - EMAIL_USER');
  console.log('   - EMAIL_PASS');
  console.log('   - JWT_SECRET');
});

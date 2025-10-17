# Pharmida Healthcare - AI Coding Instructions

## Project Architecture

**Tech Stack:** Node.js + Express backend with vanilla HTML/CSS/JS frontend, SQLite database, no bundlers
**Structure:** Monolithic full-stack app with static file serving from root directory

### Key Components
- `server.js` - Main Express server (800+ lines) with all API endpoints and middleware
- `index.html` - Homepage with product catalog and search
- `admin*.html` - Admin panel pages for product/order management
- `style.css` - Global styles (800+ lines) with healthcare green theme
- `translations/` - i18n support (bn, en, hi, mr, ta, te)

## Database Schema (SQLite)

**8 Main Tables:** products, orders, carts, sessions, profiles, prescriptions, ambulance_requests, doctor_appointments, users, payments

**Key Patterns:**
- Admin authentication via session tokens (not JWT) in `sessions` table
- User authentication via JWT stored in HttpOnly cookies
- File uploads stored in `assets/uploads/` with database references
- Cart data persisted server-side with unique cart IDs

## Critical API Patterns

### Authentication
```javascript
// Admin auth middleware - checks session table or static password
function requireAdmin(req, res, next) // Used for all admin endpoints
// User auth via JWT in cookies, verified with JWT_SECRET
```

### File Upload Strategy
```javascript
// Two multer configs: regular (2MB, images) vs prescriptions (5MB, PDF+images)
const upload = multer({ storage, limits: { fileSize: 2 * 1024 * 1024 } })
const prescriptionUpload = multer({ limits: { fileSize: 5 * 1024 * 1024 } })
```

### API Response Format
All endpoints return: `{ ok: true, data... }` or `{ error: 'message' }`

## Development Workflow

### Start Commands
```powershell
npm install
npm start  # Runs on localhost:3000
# OR use start-and-test.ps1 for automatic browser opening
```

### Admin Access
- Login: `http://localhost:3000/admin-login.html`
- Default password: `admin123` (set via ADMIN_PASSWORD env var)
- Session-based auth with HttpOnly cookies

### Key Environment Variables
```
ADMIN_PASSWORD=admin123
JWT_SECRET=your-super-secret-jwt-key
RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
EMAIL_USER, EMAIL_PASS (Gmail SMTP)
```

## Frontend Architecture

### Page Structure
- **Customer pages:** `index.html`, `cart.html`, `profile.html`, `login.html`, `register.html`
- **Service pages:** `upload-prescription.html`, `scan-prescription.html`, `call-ambulance.html`, `doctor-on-call.html`
- **Admin pages:** `admin-login.html`, `admin.html`, `admin-dashboard.html`, `super-admin.html`

### State Management
- Client-side cart in localStorage + server persistence
- User session via localStorage (`user_name`, `user_email`) + JWT cookies
- Real-time updates via Server-Sent Events (`/events` endpoint)

### UI Patterns
- Healthcare green color scheme (`#206030`, `#f8fff8`)
- Responsive design with max-width containers (1800px)
- Inline styles mixed with `style.css` classes
- Marquee news bar on homepage

## Business Logic Patterns

### Healthcare Features
- **Prescription Upload:** File validation, AI scan simulation, admin approval workflow
- **Emergency Services:** Ambulance requests, doctor appointments with status tracking
- **E-commerce:** Product catalog, cart, checkout, order tracking

### Payment Integration
- Razorpay gateway with signature verification
- Order creation on successful payment verification
- Email notifications for confirmations

### Multi-language Support
JSON files in `translations/` directory for 6 languages (Bengali, English, Hindi, Marathi, Tamil, Telugu)

## Development Guidelines

### Adding New Endpoints
1. Add route in `server.js` (group by feature)
2. Use `requireAdmin` middleware for admin-only endpoints
3. Follow `{ ok: true }` response pattern
4. Handle file cleanup on errors with `fs.unlink()`

### Database Changes
1. Add `ALTER TABLE` statements in `initDb()` function
2. Check column existence before adding: `PRAGMA table_info(table_name)`
3. Use parameterized queries to prevent SQL injection

### Frontend Integration
1. Static files served from root directory via `express.static(__dirname)`
2. API calls use relative paths (`/api/...`)
3. Form submissions handle multipart data for file uploads
4. Error handling with user-friendly messages

### Testing
- `test-backend.js` - Basic API endpoint testing
- Manual testing via admin panel and customer pages
- Use `start-and-test.ps1` for comprehensive page testing

## Common Gotchas

- **Duplicate Express imports** in server.js (line 8 & 12) - known issue, doesn't break functionality
- **File upload cleanup** - Always `fs.unlink()` uploaded files on errors
- **HTTPS redirects** - Hardcoded for production domain (pharmidahealthcare.com)
- **SQLite connection sharing** - Single `db` instance across all endpoints
- **Admin password** - Default `admin123` must be changed via environment variable
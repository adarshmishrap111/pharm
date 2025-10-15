// ============= CATEGORIES MANAGEMENT API =============
// Copy this code and add to server.js BEFORE app.listen()

// Create Category (Admin)
app.post('/api/categories', requireAdmin, async (req, res) => {
  try {
    const { name, icon, description } = req.body;
    if (!name) return res.status(400).json({ error: 'Category name required' });
    
    const now = new Date().toISOString();
    
    // Ensure categories table exists
    await db.exec(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        icon TEXT,
        description TEXT,
        createdAt TEXT
      );
    `);
    
    const result = await db.run(
      'INSERT INTO categories (name, icon, description, createdAt) VALUES (?, ?, ?, ?)',
      name, icon || null, description || null, now
    );
    
    const category = await db.get('SELECT * FROM categories WHERE id = ?', result.lastID);
    res.json({ ok: true, category });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get All Categories
app.get('/api/categories', async (req, res) => {
  try {
    // Ensure categories table exists
    await db.exec(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        icon TEXT,
        description TEXT,
        createdAt TEXT
      );
    `);
    
    const categories = await db.all('SELECT * FROM categories ORDER BY name ASC');
    
    // Count products per category
    for (let cat of categories) {
      const count = await db.get('SELECT COUNT(*) as count FROM products WHERE category = ?', cat.name);
      cat.productCount = count ? count.count : 0;
    }
    
    res.json({ ok: true, categories });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete Category (Admin)
app.delete('/api/categories/:id', requireAdmin, async (req, res) => {
  try {
    await db.run('DELETE FROM categories WHERE id = ?', req.params.id);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update Category (Admin)
app.put('/api/categories/:id', requireAdmin, async (req, res) => {
  try {
    const { name, icon, description } = req.body;
    await db.run(
      'UPDATE categories SET name=?, icon=?, description=? WHERE id=?',
      name, icon, description, req.params.id
    );
    const category = await db.get('SELECT * FROM categories WHERE id = ?', req.params.id);
    res.json({ ok: true, category });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

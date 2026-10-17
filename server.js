const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const db = new Database('data.db');

db.exec(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL
)`);

// Step 4: HTTPS (cloud pe http ko https pe redirect)
app.set('trust proxy', 1);
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' &&
      req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect('https://' + req.headers.host + req.url);
  }
  next();
});

// Step 5: Security headers + monitoring (logging) + rate limit
app.use(helmet());
app.use(morgan('combined'));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 100 }));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false, limit: '10kb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Step 1 + 2 + 3: Validation, sanitization, prepared statement
app.post('/api/users',
  [
    body('name').trim().isLength({ min: 2, max: 50 })
      .withMessage('Name 2-50 characters ka hona chahiye').escape(),
    body('email').trim().isEmail()
      .withMessage('Valid email daalo').normalizeEmail()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email } = req.body;
    // Prepared statement: ? placeholders se SQL injection nahi hota
    db.prepare('INSERT INTO users (name, email) VALUES (?, ?)').run(name, email);
    res.status(201).json({ message: 'User saved' });
  }
);

app.get('/api/users', (req, res) => {
  res.json(db.prepare('SELECT id, name, email FROM users').all());
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Error handler (details user ko nahi dikhate)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server running on port ' + PORT));
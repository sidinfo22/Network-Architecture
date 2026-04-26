import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import Database from 'better-sqlite3';

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, 'server', 'data');
const DB_PATH = path.join(DATA_DIR, 'app.db');
const SESSION_COOKIE = 'summit_admin_session';
const PORT = 4000;
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;
const DEFAULT_ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'summitcare123';

fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS admin_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    admin_id INTEGER NOT NULL,
    token_hash TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES admins(id)
  );

  CREATE TABLE IF NOT EXISTS contact_submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS page_views (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    path TEXT NOT NULL,
    title TEXT,
    referrer TEXT,
    ip_address TEXT,
    user_agent TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`);

seedDefaultAdmin();

const app = express();
app.use(express.json({ limit: '200kb' }));

app.get('/api/health', (_request, response) => {
  response.json({ ok: true });
});

app.post('/api/contact', (request, response) => {
  const name = sanitizeText(request.body?.name, 120);
  const email = sanitizeText(request.body?.email, 160);
  const subject = sanitizeText(request.body?.subject, 180);
  const message = sanitizeText(request.body?.message, 4000);

  if (!name || !email || !subject || !message) {
    response.status(400).json({ error: 'All fields are required.' });
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    response.status(400).json({ error: 'Please enter a valid email address.' });
    return;
  }

  db.prepare(`
    INSERT INTO contact_submissions (name, email, subject, message, ip_address, user_agent)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    name,
    email,
    subject,
    message,
    request.ip,
    sanitizeText(request.get('user-agent') || '', 255),
  );

  response.status(201).json({ ok: true });
});

app.post('/api/analytics/pageview', (request, response) => {
  const pagePath = sanitizePath(request.body?.path);
  const title = sanitizeText(request.body?.title || '', 180);
  const referrer = sanitizeText(request.body?.referrer || '', 255);

  if (!pagePath) {
    response.status(400).json({ error: 'A valid path is required.' });
    return;
  }

  db.prepare(`
    INSERT INTO page_views (path, title, referrer, ip_address, user_agent)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    pagePath,
    title,
    referrer,
    request.ip,
    sanitizeText(request.get('user-agent') || '', 255),
  );

  response.status(201).json({ ok: true });
});

app.post('/api/admin/login', (request, response) => {
  const username = sanitizeText(request.body?.username, 80);
  const password = typeof request.body?.password === 'string' ? request.body.password : '';
  const admin = db.prepare('SELECT * FROM admins WHERE username = ?').get(username);

  if (!admin || !verifyPassword(password, admin.password_hash)) {
    response.status(401).json({ error: 'Invalid username or password.' });
    return;
  }

  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS).toISOString();

  db.prepare(`
    INSERT INTO admin_sessions (admin_id, token_hash, expires_at)
    VALUES (?, ?, ?)
  `).run(admin.id, tokenHash, expiresAt);

  response.setHeader(
    'Set-Cookie',
    `${SESSION_COOKIE}=${token}; HttpOnly; Path=/; Max-Age=${Math.floor(SESSION_TTL_MS / 1000)}; SameSite=Lax`,
  );

  response.json({ ok: true, username: admin.username });
});

app.get('/api/admin/me', (request, response) => {
  const session = requireAdminSession(request);
  if (!session) {
    response.status(401).json({ error: 'Unauthorized.' });
    return;
  }

  response.json({ username: session.username });
});

app.post('/api/admin/logout', (request, response) => {
  const token = getCookie(request, SESSION_COOKIE);
  if (token) {
    db.prepare('DELETE FROM admin_sessions WHERE token_hash = ?').run(hashToken(token));
  }

  response.setHeader('Set-Cookie', `${SESSION_COOKIE}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`);
  response.json({ ok: true });
});

app.get('/api/admin/submissions', (request, response) => {
  const session = requireAdminSession(request);
  if (!session) {
    response.status(401).json({ error: 'Unauthorized.' });
    return;
  }

  const submissions = db.prepare(`
    SELECT id, name, email, subject, message, created_at
    FROM contact_submissions
    ORDER BY datetime(created_at) DESC
    LIMIT 100
  `).all();

  response.json({ submissions });
});

app.get('/api/admin/analytics', (request, response) => {
  const session = requireAdminSession(request);
  if (!session) {
    response.status(401).json({ error: 'Unauthorized.' });
    return;
  }

  const submissionCount = db.prepare('SELECT COUNT(*) AS count FROM contact_submissions').get().count;
  const pageViewCount = db.prepare('SELECT COUNT(*) AS count FROM page_views').get().count;
  const topPageRow = db.prepare(`
    SELECT path, COUNT(*) AS views
    FROM page_views
    GROUP BY path
    ORDER BY views DESC
    LIMIT 1
  `).get();

  const pages = db.prepare(`
    SELECT path, COUNT(*) AS views
    FROM page_views
    GROUP BY path
    ORDER BY views DESC
    LIMIT 20
  `).all();

  response.json({
    summary: {
      submissionCount,
      pageViewCount,
      topPage: topPageRow?.path || '',
    },
    pages,
  });
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`API server listening on http://127.0.0.1:${PORT}`);
});

function sanitizeText(value, maxLength) {
  if (typeof value !== 'string') {
    return '';
  }

  return value
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .trim()
    .slice(0, maxLength);
}

function sanitizePath(value) {
  const pathValue = sanitizeText(value, 180);
  if (!pathValue.startsWith('/')) {
    return '';
  }

  return pathValue.replace(/[^a-zA-Z0-9\-_/]/g, '');
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derived}`;
}

function verifyPassword(password, storedValue) {
  const [salt, hash] = storedValue.split(':');
  if (!salt || !hash) {
    return false;
  }

  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(derived, 'hex'));
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function seedDefaultAdmin() {
  const admin = db.prepare('SELECT id FROM admins WHERE username = ?').get(DEFAULT_ADMIN_USERNAME);
  if (admin) {
    return;
  }

  db.prepare('INSERT INTO admins (username, password_hash) VALUES (?, ?)').run(
    DEFAULT_ADMIN_USERNAME,
    hashPassword(DEFAULT_ADMIN_PASSWORD),
  );
}

function getCookie(request, key) {
  const cookieHeader = request.headers.cookie;
  if (!cookieHeader) {
    return '';
  }

  return cookieHeader
    .split(';')
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${key}=`))
    ?.slice(key.length + 1) || '';
}

function requireAdminSession(request) {
  const token = getCookie(request, SESSION_COOKIE);
  if (!token) {
    return null;
  }

  const tokenHash = hashToken(token);
  const session = db.prepare(`
    SELECT admins.username, admin_sessions.expires_at
    FROM admin_sessions
    INNER JOIN admins ON admins.id = admin_sessions.admin_id
    WHERE admin_sessions.token_hash = ?
  `).get(tokenHash);

  if (!session) {
    return null;
  }

  if (new Date(session.expires_at).getTime() < Date.now()) {
    db.prepare('DELETE FROM admin_sessions WHERE token_hash = ?').run(tokenHash);
    return null;
  }

  return session;
}

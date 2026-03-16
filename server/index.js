require('dotenv').config();
const express = require('express');
const session = require('express-session');
const fileUpload = require('express-fileupload');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  createParentPath: true,
}));

// Trust proxy (Railway, Render, etc.)
app.set('trust proxy', 1);

// Session with PostgreSQL store
const pgSession = require('connect-pg-simple')(session);
app.use(session({
  store: new pgSession({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
  }),
  secret: process.env.SESSION_SECRET || 'kingbafete-secret-change-me',
  resave: false,
  saveUninitialized: false,
  proxy: true,
  cookie: {
    secure: false,
    sameSite: 'lax',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24h
  },
}));

// Make prisma available in routes
app.locals.prisma = prisma;

// Static files
app.use('/uploads', express.static(path.join(__dirname, '..', 'public', 'uploads')));
app.use('/images', express.static(path.join(__dirname, '..', 'public', 'images')));

// API routes
app.use('/api', require('./routes/api'));

// Admin routes
app.use('/admin', require('./routes/admin'));

// Serve frontend
app.use(express.static(path.join(__dirname, '..', 'public')));

// SPA fallback for blog/conte pages
app.get('/contes', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'contes.html'));
});
app.get('/contes/:slug', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'conte.html'));
});
app.get('/blog/:slug', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'article.html'));
});

// Catch-all
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`King Bafété server running on port ${PORT}`);
});

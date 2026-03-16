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

// Session
app.use(session({
  secret: process.env.SESSION_SECRET || 'kingbafete-secret-change-me',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production' && process.env.TRUST_PROXY === '1',
    maxAge: 24 * 60 * 60 * 1000, // 24h
  },
}));

if (process.env.TRUST_PROXY === '1') {
  app.set('trust proxy', 1);
}

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

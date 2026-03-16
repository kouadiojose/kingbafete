const express = require('express');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
const { requireAuth } = require('../middleware/auth');
const router = express.Router();

// ---- Auth Routes ----
router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'admin', 'login.html'));
});

router.post('/login', async (req, res) => {
  try {
    const prisma = req.app.locals.prisma;
    const { email, password } = req.body;
    const isJson = req.headers['content-type']?.includes('application/json');
    console.log('Login attempt for:', email, '| session ID:', req.sessionID);
    const user = await prisma.adminUser.findUnique({ where: { email } });
    if (!user) {
      console.log('User not found:', email);
      if (isJson) return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
      return res.redirect('/admin/login?error=1');
    }
    if (!bcrypt.compareSync(password, user.password)) {
      console.log('Wrong password for:', email);
      if (isJson) return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
      return res.redirect('/admin/login?error=1');
    }
    req.session.adminId = user.id;
    req.session.adminName = user.name;
    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
        if (isJson) return res.status(500).json({ error: 'Erreur de session' });
        return res.redirect('/admin/login?error=1');
      }
      console.log('Login OK for:', email, '| session ID:', req.sessionID, '| adminId:', user.id);
      if (isJson) return res.json({ success: true });
      res.redirect('/admin');
    });
  } catch (err) {
    console.error('Login error:', err);
    if (req.headers['content-type']?.includes('application/json')) {
      return res.status(500).json({ error: 'Erreur serveur' });
    }
    res.redirect('/admin/login?error=1');
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

router.get('/me', requireAuth, async (req, res) => {
  const prisma = req.app.locals.prisma;
  const user = await prisma.adminUser.findUnique({
    where: { id: req.session.adminId },
    select: { id: true, email: true, name: true },
  });
  res.json(user);
});

// ---- Dashboard ----
router.get('/', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'admin', 'dashboard.html'));
});

// ---- Upload ----
router.post('/upload', requireAuth, async (req, res) => {
  if (!req.files || !req.files.file) {
    return res.status(400).json({ error: 'Aucun fichier' });
  }
  const file = req.files.file;
  const ext = path.extname(file.name).toLowerCase();
  const allowed = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  if (!allowed.includes(ext)) {
    return res.status(400).json({ error: 'Format non autorisé' });
  }
  const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  const uploadPath = path.join(__dirname, '..', '..', 'public', 'uploads', filename);
  await file.mv(uploadPath);
  res.json({ url: `/uploads/${filename}` });
});

// ---- Settings CRUD ----
router.get('/api/settings', requireAuth, async (req, res) => {
  const prisma = req.app.locals.prisma;
  let settings = await prisma.siteSettings.findFirst();
  if (!settings) settings = await prisma.siteSettings.create({ data: {} });
  res.json(settings);
});

router.put('/api/settings', requireAuth, async (req, res) => {
  const prisma = req.app.locals.prisma;
  const data = req.body;
  delete data.id;
  let settings = await prisma.siteSettings.findFirst();
  if (settings) {
    settings = await prisma.siteSettings.update({ where: { id: settings.id }, data });
  } else {
    settings = await prisma.siteSettings.create({ data });
  }
  res.json(settings);
});

// ---- Generic CRUD factory ----
function crudRoutes(modelName, opts = {}) {
  const r = express.Router();

  r.get('/', requireAuth, async (req, res) => {
    const prisma = req.app.locals.prisma;
    const items = await prisma[modelName].findMany({
      orderBy: opts.orderBy || { createdAt: 'desc' },
    });
    res.json(items);
  });

  r.get('/:id', requireAuth, async (req, res) => {
    const prisma = req.app.locals.prisma;
    const item = await prisma[modelName].findUnique({ where: { id: parseInt(req.params.id) } });
    if (!item) return res.status(404).json({ error: 'Non trouvé' });
    res.json(item);
  });

  r.post('/', requireAuth, async (req, res) => {
    const prisma = req.app.locals.prisma;
    const data = req.body;
    if (data.sortOrder) data.sortOrder = parseInt(data.sortOrder);
    if (data.featured !== undefined) data.featured = data.featured === true || data.featured === 'true';
    if (data.published !== undefined) data.published = data.published === true || data.published === 'true';
    if (data.wide !== undefined) data.wide = data.wide === true || data.wide === 'true';
    if (data.tall !== undefined) data.tall = data.tall === true || data.tall === 'true';
    if (data.read !== undefined) data.read = data.read === true || data.read === 'true';
    const item = await prisma[modelName].create({ data });
    res.json(item);
  });

  r.put('/:id', requireAuth, async (req, res) => {
    const prisma = req.app.locals.prisma;
    const data = req.body;
    delete data.id;
    delete data.createdAt;
    delete data.updatedAt;
    if (data.sortOrder) data.sortOrder = parseInt(data.sortOrder);
    if (data.featured !== undefined) data.featured = data.featured === true || data.featured === 'true';
    if (data.published !== undefined) data.published = data.published === true || data.published === 'true';
    if (data.wide !== undefined) data.wide = data.wide === true || data.wide === 'true';
    if (data.tall !== undefined) data.tall = data.tall === true || data.tall === 'true';
    if (data.read !== undefined) data.read = data.read === true || data.read === 'true';
    const item = await prisma[modelName].update({ where: { id: parseInt(req.params.id) }, data });
    res.json(item);
  });

  r.delete('/:id', requireAuth, async (req, res) => {
    const prisma = req.app.locals.prisma;
    await prisma[modelName].delete({ where: { id: parseInt(req.params.id) } });
    res.json({ success: true });
  });

  return r;
}

router.use('/api/books', crudRoutes('book', { orderBy: [{ featured: 'desc' }, { sortOrder: 'asc' }] }));
router.use('/api/interviews', crudRoutes('interview', { orderBy: [{ sortOrder: 'asc' }] }));
router.use('/api/blog', crudRoutes('blogPost'));
router.use('/api/contes', crudRoutes('conte'));
router.use('/api/gallery', crudRoutes('galleryImage', { orderBy: [{ sortOrder: 'asc' }] }));
router.use('/api/contacts', crudRoutes('contactMessage'));

// ---- Stats ----
router.get('/api/stats', requireAuth, async (req, res) => {
  const prisma = req.app.locals.prisma;
  const [books, interviews, posts, contes, gallery, messages, unread] = await Promise.all([
    prisma.book.count(),
    prisma.interview.count(),
    prisma.blogPost.count(),
    prisma.conte.count(),
    prisma.galleryImage.count(),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { read: false } }),
  ]);
  res.json({ books, interviews, posts, contes, gallery, messages, unread });
});

module.exports = router;

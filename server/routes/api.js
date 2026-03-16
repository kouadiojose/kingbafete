const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

// GET /api/settings
router.get('/settings', async (req, res) => {
  const prisma = req.app.locals.prisma;
  let settings = await prisma.siteSettings.findFirst();
  if (!settings) {
    settings = await prisma.siteSettings.create({ data: {} });
  }
  res.json(settings);
});

// GET /api/books
router.get('/books', async (req, res) => {
  const prisma = req.app.locals.prisma;
  const books = await prisma.book.findMany({ orderBy: [{ featured: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }] });
  res.json(books);
});

// GET /api/interviews
router.get('/interviews', async (req, res) => {
  const prisma = req.app.locals.prisma;
  const interviews = await prisma.interview.findMany({ orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }] });
  res.json(interviews);
});

// GET /api/blog
router.get('/blog', async (req, res) => {
  const prisma = req.app.locals.prisma;
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json(posts);
});

// GET /api/blog/:slug
router.get('/blog/:slug', async (req, res) => {
  const prisma = req.app.locals.prisma;
  const post = await prisma.blogPost.findUnique({ where: { slug: req.params.slug } });
  if (!post) return res.status(404).json({ error: 'Article non trouvé' });
  res.json(post);
});

// GET /api/contes
router.get('/contes', async (req, res) => {
  const prisma = req.app.locals.prisma;
  const contes = await prisma.conte.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json(contes);
});

// GET /api/contes/:slug
router.get('/contes/:slug', async (req, res) => {
  const prisma = req.app.locals.prisma;
  const conte = await prisma.conte.findUnique({ where: { slug: req.params.slug } });
  if (!conte) return res.status(404).json({ error: 'Conte non trouvé' });
  res.json(conte);
});

// GET /api/gallery
router.get('/gallery', async (req, res) => {
  const prisma = req.app.locals.prisma;
  const images = await prisma.galleryImage.findMany({ orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }] });
  res.json(images);
});

// POST /api/contact
router.post('/contact', async (req, res) => {
  const prisma = req.app.locals.prisma;
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'Tous les champs sont requis' });
  }

  // Save to DB
  const contact = await prisma.contactMessage.create({
    data: { name, email, subject, message },
  });

  // Try to send email
  try {
    const settings = await prisma.siteSettings.findFirst();
    const toEmail = settings?.contactEmail || 'fetekimpiobi01@gmail.com';

    if (process.env.SMTP_HOST) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.SMTP_FROM || 'noreply@kingbafete.com',
        to: toEmail,
        replyTo: email,
        subject: `[King Bafété] ${subject}`,
        html: `
          <h3>Nouveau message du site King Bafété</h3>
          <p><strong>Nom:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Objet:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `,
      });
    }
  } catch (err) {
    console.error('Email error:', err.message);
  }

  res.json({ success: true, message: 'Message envoyé avec succès' });
});

module.exports = router;

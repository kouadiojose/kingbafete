function requireAuth(req, res, next) {
  if (req.session && req.session.adminId) {
    return next();
  }
  if (req.headers.accept && req.headers.accept.includes('application/json')) {
    return res.status(401).json({ error: 'Non autorisé' });
  }
  res.redirect('/admin/login');
}

module.exports = { requireAuth };

const requireRole = (role) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false, 
      message: 'Authentification requise' 
    });
  }

  if (req.user.role !== role) {
    return res.status(403).json({ 
      success: false, 
      message: 'Accès refusé' 
    });
  }
  
  next();
};

module.exports = requireRole;

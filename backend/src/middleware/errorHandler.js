const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Firebase errors
  if (err.code) {
    switch (err.code) {
      case 'auth/email-already-exists':
        return res.status(400).json({
          success: false,
          message: 'Cet email est déjà utilisé',
        });
      case 'auth/invalid-email':
        return res.status(400).json({
          success: false,
          message: 'Email invalide',
        });
      case 'auth/weak-password':
        return res.status(400).json({
          success: false,
          message: 'Le mot de passe est trop faible',
        });
      case 'auth/user-not-found':
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé',
        });
      case 'auth/wrong-password':
        return res.status(401).json({
          success: false,
          message: 'Mot de passe incorrect',
        });
      case 'permission-denied':
        return res.status(403).json({
          success: false,
          message: 'Accès refusé',
        });
      case 'not-found':
        return res.status(404).json({
          success: false,
          message: 'Ressource non trouvée',
        });
      case 'already-exists':
        return res.status(400).json({
          success: false,
          message: 'Cette ressource existe déjà',
        });
      default:
        return res.status(500).json({
          success: false,
          message: 'Erreur serveur',
        });
    }
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Erreur de validation',
      errors: err.errors,
    });
  }

  // Default error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erreur serveur interne';

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;

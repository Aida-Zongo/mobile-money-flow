const { auth, db } = require('../config/firebase');

// Middleware pour vérifier le token Firebase
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token manquant. Veuillez vous connecter.' 
      });
    }

    // Vérifier le token Firebase
    const decoded = await auth.verifyIdToken(token);
    
    // Récupérer l'utilisateur depuis Firestore
    const userDoc = await db.collection('users').doc(decoded.uid).get();
    
    if (!userDoc.exists) {
      return res.status(401).json({ 
        success: false, 
        message: 'Utilisateur non trouvé' 
      });
    }

    const userData = userDoc.data();

    if (!userData.isActive) {
      return res.status(401).json({ 
        success: false, 
        message: 'Compte désactivé' 
      });
    }

    // Ajouter l'utilisateur à la requête
    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      role: userData.role || 'user',
      ...userData
    };
    
    next();
  } catch (error) {
    console.error('Erreur auth middleware:', error);
    
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expiré. Veuillez vous reconnecter.' 
      });
    }
    
    if (error.code === 'auth/id-token-revoked') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token révoqué. Veuillez vous reconnecter.' 
      });
    }
    
    return res.status(401).json({ 
      success: false, 
      message: 'Token invalide' 
    });
  }
};

// Middleware pour vérifier le rôle admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Accès refusé. Droits administrateur requis.' 
    });
  }
  next();
};

// Middleware optionnel (token non requis mais si présent, on ajoute l'utilisateur)
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    
    if (token) {
      const decoded = await auth.verifyIdToken(token);
      const userDoc = await db.collection('users').doc(decoded.uid).get();
      
      if (userDoc.exists) {
        const userData = userDoc.data();
        req.user = {
          uid: decoded.uid,
          email: decoded.email,
          role: userData.role || 'user',
          ...userData
        };
      }
    }
    
    next();
  } catch (error) {
    // Ignorer les erreurs dans le middleware optionnel
    next();
  }
};

module.exports = {
  verifyToken,
  requireAdmin,
  optionalAuth
};

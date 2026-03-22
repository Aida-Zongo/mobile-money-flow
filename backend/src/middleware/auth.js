const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET ||
  'moneyflow_secret_2026';

const verifyToken = async (req, res, next) => {
  try {
    const authHeader =
      req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token manquant'
      });
    }

    const token = authHeader.split('Bearer ')[1];

    try {
      // Vérifie le JWT
      const decoded = jwt.verify(
        token, JWT_SECRET
      );
      req.user = {
        uid: decoded.uid || decoded.sub,
        email: decoded.email,
        name: decoded.name,
      };
      console.log('Token decoded uid:', req.user?.uid);
      return next();
    } catch (jwtError) {
      // Si JWT échoue, essaie de décoder
      // le token Firebase manuellement
      try {
        const parts = token.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(
            Buffer.from(parts[1], 'base64url')
              .toString('utf8')
          );

          if (payload.exp &&
              payload.exp < Date.now() / 1000) {
            return res.status(401).json({
              success: false,
              message: 'Token expiré'
            });
          }

          req.user = {
            uid: payload.user_id ||
                 payload.sub ||
                 payload.uid,
            email: payload.email,
            name: payload.name || payload.email,
          };

          if (!req.user.uid) {
            throw new Error('UID manquant');
          }

          return next();
        }
      } catch (decodeError) {
        return res.status(401).json({
          success: false,
          message: 'Token invalide'
        });
      }
    }

    return res.status(401).json({
      success: false,
      message: 'Token invalide'
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erreur auth: ' + error.message
    });
  }
};

const requireAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.uid);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Accès admin requis'
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false, message: error.message
    });
  }
};

module.exports = { verifyToken, requireAdmin };

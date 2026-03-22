const express = require('express');
const router = express.Router();
const {
  register, login, getMe,
  getNotifications, markNotificationsRead,
  changePassword, deleteAccount, updateProfile
} = require('../controllers/auth.controller');
const { verifyToken } =
  require('../middleware/auth');

// Routes PUBLIQUES - sans verifyToken
router.post('/register', register);
router.post('/login', login);

// Routes PROTÉGÉES - avec verifyToken
router.get('/me', verifyToken, getMe);
router.get('/notifications',
  verifyToken, getNotifications);
router.put('/notifications/read',
  verifyToken, markNotificationsRead);
router.put('/change-password',
  verifyToken, changePassword);
router.delete('/account',
  verifyToken, deleteAccount);
router.put('/profile',
  verifyToken, updateProfile);

module.exports = router;

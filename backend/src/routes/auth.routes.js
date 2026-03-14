const express = require('express');
const { body } = require('express-validator');
const {
  register,
  login,
  getMe,
  updateMe,
  getNotifications,
  markNotificationsRead,
} = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Routes d'authentification
 */

// Validation rules
const registerValidation = [
  body('uid')
    .notEmpty()
    .withMessage('L\'UID est requis'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Le nom est requis'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email invalide'),
  body('phone')
    .optional()
    .trim(),
  body('operator')
    .optional()
    .trim(),
];

const loginValidation = [
  body('uid')
    .notEmpty()
    .withMessage('L\'UID est requis'),
];

const updateMeValidation = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Le nom ne peut pas être vide'),
  body('phone')
    .optional()
    .trim(),
  body('operator')
    .optional()
    .isIn(['orange_money', 'moov_money', 'wave', 'other'])
    .withMessage('Opérateur invalide'),
];

// Routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', verifyToken, getMe);
router.put('/me', verifyToken, updateMeValidation, updateMe);
router.get('/notifications', verifyToken, getNotifications);
router.put('/notifications/read', verifyToken, markNotificationsRead);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  register, login, getMe,
  getNotifications, markNotificationsRead,
  changePassword, deleteAccount, updateProfile
} = require('../controllers/auth.controller');
const { verifyToken } =
  require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Gestion de l'authentification et du profil utilisateur
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Inscrire un nouvel utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               phone:
 *                 type: string
 *               operator:
 *                 type: string
 *                 enum: [orange_money, moov_money, wave, especes, other]
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *       400:
 *         description: Données invalides ou email déjà utilisé
 */
router.post('/register', register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Connecter un utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Connexion réussie, retourne un token JWT
 *       401:
 *         description: Identifiants incorrects
 */
router.post('/login', login);

// Routes PROTÉGÉES - avec verifyToken
/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Obtenir les informations de l'utilisateur connecté
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Informations de l'utilisateur
 *       401:
 *         description: Non autorisé
 */
router.get('/me', verifyToken, getMe);

/**
 * @swagger
 * /auth/notifications:
 *   get:
 *     summary: Obtenir les notifications de l'utilisateur
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des notifications
 */
router.get('/notifications',
  verifyToken, getNotifications);

/**
 * @swagger
 * /auth/notifications/read:
 *   put:
 *     summary: Marquer toutes les notifications comme lues
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notifications marquées comme lues
 */
router.put('/notifications/read',
  verifyToken, markNotificationsRead);

/**
 * @swagger
 * /auth/change-password:
 *   put:
 *     summary: Changer le mot de passe
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Mot de passe modifié
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Mot de passe actuel incorrect
 */
router.put('/change-password',
  verifyToken, changePassword);

/**
 * @swagger
 * /auth/account:
 *   delete:
 *     summary: Supprimer le compte utilisateur et toutes ses données
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Compte supprimé
 */
router.delete('/account',
  verifyToken, deleteAccount);

/**
 * @swagger
 * /auth/profile:
 *   put:
 *     summary: Mettre à jour le profil utilisateur
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               operator:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profil mis à jour
 */
router.put('/profile',
  verifyToken, updateProfile);

module.exports = router;

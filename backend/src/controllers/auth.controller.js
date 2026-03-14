const { auth, db } = require('../config/firebase');
const { validationResult } = require('express-validator');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         uid:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         role:
 *           type: string
 *           enum: [user, admin]
 *         operator:
 *           type: string
 *           enum: [orange_money, moov_money, wave, other]
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Inscrire un nouvel utilisateur
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
 *                 enum: [orange_money, moov_money, wave, other]
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 uid:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Erreur de validation ou email déjà existant
 *       500:
 *         description: Erreur serveur
 */
const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Erreur de validation',
        errors: errors.array(),
      });
    }

    const { uid, name, email, phone, operator } = req.body;

    // L'utilisateur est déjà créé dans Firebase Auth côté client
    // On crée juste le document dans Firestore
    const userDoc = {
      uid,
      name,
      email,
      phone: phone || '',
      operator: operator || 'orange_money',
      location: 'Non spécifiée',
      role: 'user', // Rôle par défaut
      isActive: true,
      createdAt: new Date(),
      lastLogin: null
    };

    await db.collection('users').doc(uid).set(userDoc);

    // Générer un token Firebase custom avec rôle
    const customToken = await auth.createCustomToken(uid, { role: 'user' });

    res.status(201).json({
      success: true,
      message: 'Utilisateur créé avec succès',
      token: customToken,
      user: {
        uid,
        name: userDoc.name,
        email: userDoc.email,
        phone: userDoc.phone,
        location: userDoc.location,
        role: userDoc.role,
        isActive: userDoc.isActive
      }
    });
  } catch (error) {
    console.error('Erreur register:', error);
    
    if (error.code === 'auth/email-already-exists') {
      return res.status(400).json({
        success: false,
        message: 'Cet email est déjà utilisé'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l\'inscription'
    });
  }
};

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Vérifier l'utilisateur après auth Firebase
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - uid
 *             properties:
 *               uid:
 *                 type: string
 *     responses:
 *       200:
 *         description: Utilisateur trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */
const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Erreur de validation',
        errors: errors.array(),
      });
    }

    const { uid } = req.body;

    // Validation
    if (!uid) {
      return res.status(400).json({
        success: false,
        message: 'UID requis'
      });
    }

    // L'utilisateur est déjà authentifié côté client avec Firebase
    // On vérifie juste qu'il existe dans Firestore
    const userDoc = await db.collection('users').doc(uid).get();
    
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

    // Générer un token Firebase custom
    const customToken = await auth.createCustomToken(uid, { 
      role: userData.role || 'user' 
    });

    // Mettre à jour la dernière connexion
    await db.collection('users').doc(uid).update({
      lastLogin: new Date()
    });

    res.json({
      success: true,
      message: 'Connexion réussie',
      token: customToken,
      user: {
        uid: userData.uid,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        location: userData.location,
        role: userData.role,
        isActive: userData.isActive
      }
    });
  } catch (error) {
    console.error('Erreur login:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la connexion'
    });
  }
};

/**
 * @swagger
 * /auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Obtenir les informations de l'utilisateur connecté
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Informations utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
const getMe = async (req, res, next) => {
  try {
    // L'utilisateur est déjà disponible via le middleware verifyToken
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé',
      });
    }

    const userData = userDoc.data();

    res.json({
      success: true,
      user: {
        uid: userData.uid,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        location: userData.location,
        role: userData.role,
        isActive: userData.isActive,
        createdAt: userData.createdAt,
        lastLogin: userData.lastLogin
      }
    });
  } catch (error) {
    console.error('Erreur getMe:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

/**
 * @swagger
 * /auth/me:
 *   put:
 *     tags: [Auth]
 *     summary: Mettre à jour les informations de l'utilisateur connecté
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
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
 *                 enum: [orange_money, moov_money, wave, other]
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
const updateMe = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Erreur de validation',
        errors: errors.array(),
      });
    }

    const { name, phone, operator } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (operator) updateData.operator = operator;

    await db.collection('users').doc(req.user.uid).update(updateData);

    const updatedUserDoc = await db.collection('users').doc(req.user.uid).get();

    res.json({
      success: true,
      user: updatedUserDoc.data(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /auth/notifications:
 *   get:
 *     tags: [Auth]
 *     summary: Obtenir les notifications de l'utilisateur
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 notifications:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       message:
 *                         type: string
 *                       type:
 *                         type: string
 *                         enum: [warning, danger, info]
 *                       isRead:
 *                         type: boolean
 *                       createdAt:
 *                         type: string
 *                 unreadCount:
 *                   type: number
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
const getNotifications = async (req, res, next) => {
  try {
    const notificationsSnapshot = await db.collection('notifications')
      .where('userId', '==', req.user.uid)
      .orderBy('createdAt', 'desc')
      .get();

    const notifications = [];
    notificationsSnapshot.forEach(doc => {
      notifications.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    const unreadCount = notifications.filter(n => !n.isRead).length;

    res.json({
      success: true,
      notifications,
      unreadCount,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /auth/notifications/read:
 *   put:
 *     tags: [Auth]
 *     summary: Marquer toutes les notifications comme lues
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notifications marquées comme lues
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
const markNotificationsRead = async (req, res, next) => {
  try {
    const notificationsSnapshot = await db.collection('notifications')
      .where('userId', '==', req.user.uid)
      .where('isRead', '==', false)
      .get();

    const batch = db.batch();
    notificationsSnapshot.forEach(doc => {
      batch.update(doc.ref, { isRead: true });
    });

    await batch.commit();

    res.json({
      success: true,
      message: 'Toutes les notifications ont été marquées comme lues',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateMe,
  getNotifications,
  markNotificationsRead,
};

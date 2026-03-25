const express = require('express');
const {
  getAllUsers,
  deleteUser,
  getGlobalStats,
} = require('../controllers/admin.controller');
const { verifyToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Routes d'administration (admin uniquement)
 */

// Routes (toutes protégées + admin requis)
router.use(verifyToken);
router.use(requireAdmin);

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Liste de tous les utilisateurs (Admin uniquement)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs récupérée
 *       403:
 *         description: Accès refusé
 */
router.get('/users', getAllUsers);

/**
 * @swagger
 * /admin/users/{id}:
 *   delete:
 *     summary: Supprimer un utilisateur (Admin uniquement)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Utilisateur supprimé
 *       403:
 *         description: Impossible de supprimer un admin
 */
router.delete('/users/:id', deleteUser);

/**
 * @swagger
 * /admin/stats:
 *   get:
 *     summary: Statistiques globales du système (Admin uniquement)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistiques récupérées
 */
router.get('/stats', getGlobalStats);

module.exports = router;

const express = require('express');
const {
  getSummary,
  getMonthly,
  getCategories,
  getDaily,
} = require('../controllers/stats.controller');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Stats
 *   description: Routes de statistiques
 */

// Routes (toutes protégées)
router.use(verifyToken);

/**
 * @swagger
 * /stats/summary:
 *   get:
 *     summary: Résumé des statistiques mensuelles
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Résumé récupéré
 */
router.get('/summary', getSummary);

/**
 * @swagger
 * /stats/monthly:
 *   get:
 *     summary: Statistiques par mois pour une année
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Données mensuelles récupérées
 */
router.get('/monthly', getMonthly);

/**
 * @swagger
 * /stats/categories:
 *   get:
 *     summary: Répartition des dépenses par catégorie
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Données par catégorie récupérées
 */
router.get('/categories', getCategories);

/**
 * @swagger
 * /stats/daily:
 *   get:
 *     summary: Évolution des dépenses quotidiennes
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Données quotidiennes récupérées
 */
router.get('/daily', getDaily);

module.exports = router;

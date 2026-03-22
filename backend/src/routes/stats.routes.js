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
router.use(verifyToken); // Middleware appliqué à toutes les routes

router.get('/summary', getSummary);
router.get('/monthly', getMonthly);
router.get('/categories', getCategories);
router.get('/daily', getDaily);

module.exports = router;

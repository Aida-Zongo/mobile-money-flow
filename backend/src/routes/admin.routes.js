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

router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.get('/stats', getGlobalStats);

module.exports = router;

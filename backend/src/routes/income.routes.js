const express = require('express');
const {
    getIncomes,
    createIncome,
    deleteIncome,
} = require('../controllers/income.controller');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Incomes
 *   description: Gestion des revenus
 */

// Routes (toutes protégées)
router.use(verifyToken);

/**
 * @swagger
 * /incomes:
 *   get:
 *     summary: Liste des revenus
 *     tags: [Incomes]
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
 *         description: Liste des revenus récupérée
 */
router.get('/', getIncomes);

/**
 * @swagger
 * /incomes:
 *   post:
 *     summary: Ajouter un nouveau revenu
 *     tags: [Incomes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - source
 *             properties:
 *               amount:
 *                 type: number
 *               source:
 *                 type: string
 *               month:
 *                 type: integer
 *               year:
 *                 type: integer
 *               note:
 *                 type: string
 *     responses:
 *       201:
 *         description: Revenu ajouté
 */
router.post('/', createIncome);

/**
 * @swagger
 * /incomes/{id}:
 *   delete:
 *     summary: Supprimer un revenu
 *     tags: [Incomes]
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
 *         description: Revenu supprimé
 */
router.delete('/:id', deleteIncome);

module.exports = router;

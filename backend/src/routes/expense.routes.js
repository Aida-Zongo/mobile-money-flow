const express = require('express');
const { body } = require('express-validator');
const {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} = require('../controllers/expense.controller');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Expenses
 *   description: Gestion des dépenses
 */

// Validation rules
const createExpenseValidation = [
  body('amount')
    .isNumeric()
    .withMessage('Le montant doit être un nombre')
    .isFloat({ min: 1 })
    .withMessage('Le montant doit être supérieur à 0'),
  body('category')
    .isIn(['alimentation', 'transport', 'sante', 'shopping', 'logement', 'telecom', 'education', 'autre'])
    .withMessage('Catégorie invalide'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('La description ne doit pas dépasser 200 caractères'),
  body('operator')
    .optional()
    .isIn(['orange_money', 'moov_money', 'wave', 'especes'])
    .withMessage('Opérateur invalide'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date invalide'),
];

const updateExpenseValidation = [
  body('amount')
    .optional()
    .isNumeric()
    .withMessage('Le montant doit être un nombre')
    .isFloat({ min: 1 })
    .withMessage('Le montant doit être supérieur à 0'),
  body('category')
    .optional()
    .isIn(['alimentation', 'transport', 'sante', 'shopping', 'logement', 'telecom', 'education', 'autre'])
    .withMessage('Catégorie invalide'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('La description ne doit pas dépasser 200 caractères'),
  body('operator')
    .optional()
    .isIn(['orange_money', 'moov_money', 'wave', 'especes'])
    .withMessage('Opérateur invalide'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date invalide'),
];

// Routes (toutes protégées)
router.use(verifyToken);

/**
 * @swagger
 * /expenses:
 *   get:
 *     summary: Liste des dépenses
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *         description: Mois (1-12)
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: "Année (ex: 2026)"
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filtrer par catégorie
 *     responses:
 *       200:
 *         description: Liste des dépenses récupérée
 */
router.get('/', getExpenses);

/**
 * @swagger
 * /expenses:
 *   post:
 *     summary: Créer une nouvelle dépense
 *     tags: [Expenses]
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
 *               - category
 *             properties:
 *               amount:
 *                 type: number
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               operator:
 *                 type: string
 *                 enum: [orange_money, moov_money, wave, especes]
 *               date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Dépense créée
 */
router.post('/', createExpenseValidation, createExpense);

/**
 * @swagger
 * /expenses/{id}:
 *   put:
 *     summary: Modifier une dépense existante
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               operator:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Dépense mise à jour
 *       404:
 *         description: Dépense non trouvée
 */
router.put('/:id', updateExpenseValidation, updateExpense);

/**
 * @swagger
 * /expenses/{id}:
 *   delete:
 *     summary: Supprimer une dépense
 *     tags: [Expenses]
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
 *         description: Dépense supprimée
 *       404:
 *         description: Dépense non trouvée
 */
router.delete('/:id', deleteExpense);

module.exports = router;

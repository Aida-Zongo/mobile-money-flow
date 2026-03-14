const express = require('express');
const { body } = require('express-validator');
const {
  getAllExpenses,
  createExpense,
  getExpenseById,
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
router.use(verifyToken); // Middleware appliqué à toutes les routes

router.get('/', getAllExpenses);
router.post('/', createExpenseValidation, createExpense);
router.get('/:id', getExpenseById);
router.put('/:id', updateExpenseValidation, updateExpense);
router.delete('/:id', deleteExpense);

module.exports = router;

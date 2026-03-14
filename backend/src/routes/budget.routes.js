const express = require('express');
const { body } = require('express-validator');
const {
  getAllBudgets,
  getBudgetsWithStatus,
  createBudget,
  updateBudget,
  deleteBudget,
} = require('../controllers/budget.controller');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Budgets
 *   description: Gestion des budgets
 */

// Validation rules
const createBudgetValidation = [
  body('category')
    .isIn(['alimentation', 'transport', 'sante', 'shopping', 'logement', 'telecom', 'education', 'autre'])
    .withMessage('Catégorie invalide'),
  body('limitAmount')
    .isNumeric()
    .withMessage('Le montant limite doit être un nombre')
    .isFloat({ min: 1 })
    .withMessage('Le montant limite doit être supérieur à 0'),
  body('month')
    .isInt({ min: 1, max: 12 })
    .withMessage('Le mois doit être entre 1 et 12'),
  body('year')
    .isInt({ min: 2020, max: 2030 })
    .withMessage('L\'année doit être valide'),
];

const updateBudgetValidation = [
  body('limitAmount')
    .optional()
    .isNumeric()
    .withMessage('Le montant limite doit être un nombre')
    .isFloat({ min: 1 })
    .withMessage('Le montant limite doit être supérieur à 0'),
  body('month')
    .optional()
    .isInt({ min: 1, max: 12 })
    .withMessage('Le mois doit être entre 1 et 12'),
  body('year')
    .optional()
    .isInt({ min: 2020, max: 2030 })
    .withMessage('L\'année doit être valide'),
];

// Routes (toutes protégées)
router.use(verifyToken); // Middleware appliqué à toutes les routes

router.get('/', getAllBudgets);
router.get('/status', getBudgetsWithStatus);
router.post('/', createBudgetValidation, createBudget);
router.put('/:id', updateBudgetValidation, updateBudget);
router.delete('/:id', deleteBudget);

module.exports = router;

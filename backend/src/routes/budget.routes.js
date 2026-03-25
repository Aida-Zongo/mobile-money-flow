const express = require('express');
const { body } = require('express-validator');
const {
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
router.use(verifyToken);

/**
 * @swagger
 * /budgets/status:
 *   get:
 *     summary: Obtenir l'état de consommation des budgets
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des budgets avec montants dépensés et pourcentages
 */
router.get('/status', getBudgetsWithStatus);

/**
 * @swagger
 * /budgets:
 *   post:
 *     summary: Créer un nouveau budget
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - category
 *               - limitAmount
 *               - month
 *               - year
 *             properties:
 *               category:
 *                 type: string
 *               limitAmount:
 *                 type: number
 *               month:
 *                 type: integer
 *               year:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Budget créé
 *       400:
 *         description: Budget déjà existant pour cette catégorie/mois
 */
router.post('/', createBudgetValidation, createBudget);

/**
 * @swagger
 * /budgets/{id}:
 *   put:
 *     summary: Modifier un budget
 *     tags: [Budgets]
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
 *               limitAmount:
 *                 type: number
 *               month:
 *                 type: integer
 *               year:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Budget mis à jour
 */
router.put('/:id', updateBudgetValidation, updateBudget);

/**
 * @swagger
 * /budgets/{id}:
 *   delete:
 *     summary: Supprimer un budget
 *     tags: [Budgets]
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
 *         description: Budget supprimé
 */
router.delete('/:id', deleteBudget);

module.exports = router;

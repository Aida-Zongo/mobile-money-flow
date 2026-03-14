const { auth, db } = require('../config/firebase');
const { validationResult } = require('express-validator');

/**
 * @swagger
 * components:
 *   schemas:
 *     Budget:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         userId:
 *           type: string
 *         category:
 *           type: string
 *           enum: [alimentation, transport, sante, shopping, logement, telecom, education, autre]
 *         limitAmount:
 *           type: number
 *         month:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         year:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /budgets:
 *   get:
 *     tags: [Budgets]
 *     summary: Obtenir tous les budgets de l'utilisateur
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
 *         description: Année
 *     responses:
 *       200:
 *         description: Liste des budgets
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 budgets:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Budget'
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
const getAllBudgets = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    let query = db.collection('budgets').where('userId', '==', req.user.uid);

    if (month) query = query.where('month', '==', parseInt(month));
    if (year) query = query.where('year', '==', parseInt(year));

    const budgetsSnapshot = await query.orderBy('year', 'desc').orderBy('month', 'desc').orderBy('category', 'asc').get();
    const budgets = [];

    budgetsSnapshot.forEach(doc => {
      budgets.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    res.json({
      success: true,
      budgets,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /budgets/status:
 *   get:
 *     tags: [Budgets]
 *     summary: Obtenir le statut des budgets avec montant dépensé
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statut des budgets
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 budgets:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       category:
 *                         type: string
 *                       limitAmount:
 *                         type: number
 *                       month:
 *                         type: integer
 *                       year:
 *                         type: integer
 *                       spent:
 *                         type: number
 *                       percent:
 *                         type: number
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
const getBudgetsWithStatus = async (req, res, next) => {
  try {
    const budgetsSnapshot = await db.collection('budgets')
      .where('userId', '==', req.user.uid)
      .get();

    const budgetsWithStatus = await Promise.all(
      budgetsSnapshot.docs.map(async (budgetDoc) => {
        const budget = {
          id: budgetDoc.id,
          ...budgetDoc.data(),
        };

        const startDate = new Date(budget.year, budget.month - 1, 1);
        const endDate = new Date(budget.year, budget.month, 0, 23, 59, 59);

        const expensesSnapshot = await db.collection('expenses')
          .where('userId', '==', req.user.uid)
          .where('category', '==', budget.category)
          .where('date', '>=', startDate)
          .where('date', '<=', endDate)
          .get();

        let spent = 0;
        expensesSnapshot.forEach(doc => {
          spent += doc.data().amount;
        });

        const percent = budget.limitAmount > 0 ? (spent / budget.limitAmount) * 100 : 0;

        return {
          ...budget,
          spent,
          percent: Math.round(percent * 100) / 100,
        };
      })
    );

    res.json({
      success: true,
      budgets: budgetsWithStatus,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /budgets:
 *   post:
 *     tags: [Budgets]
 *     summary: Créer un nouveau budget
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
 *                 enum: [alimentation, transport, sante, shopping, logement, telecom, education, autre]
 *               limitAmount:
 *                 type: number
 *                 minimum: 1
 *               month:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 12
 *               year:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Budget créé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 budget:
 *                   $ref: '#/components/schemas/Budget'
 *       400:
 *         description: Erreur de validation ou budget déjà existant
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
const createBudget = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Erreur de validation',
        errors: errors.array(),
      });
    }

    const { category, limitAmount, month, year } = req.body;

    // Vérifier si un budget existe déjà pour cette catégorie et période
    const existingBudgetSnapshot = await db.collection('budgets')
      .where('userId', '==', req.user.uid)
      .where('category', '==', category)
      .where('month', '==', parseInt(month))
      .where('year', '==', parseInt(year))
      .get();

    if (!existingBudgetSnapshot.empty) {
      return res.status(400).json({
        success: false,
        message: 'Un budget existe déjà pour cette catégorie et cette période',
      });
    }

    const budgetData = {
      userId: req.user.uid,
      category,
      limitAmount: parseFloat(limitAmount),
      month: parseInt(month),
      year: parseInt(year),
      createdAt: new Date(),
    };

    const budgetRef = await db.collection('budgets').add(budgetData);
    const budget = {
      id: budgetRef.id,
      ...budgetData,
    };

    res.status(201).json({
      success: true,
      budget,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /budgets/{id}:
 *   put:
 *     tags: [Budgets]
 *     summary: Mettre à jour un budget
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               limitAmount:
 *                 type: number
 *                 minimum: 1
 *               month:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 12
 *               year:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Budget mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 budget:
 *                   $ref: '#/components/schemas/Budget'
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Budget non trouvé
 *       500:
 *         description: Erreur serveur
 */
const updateBudget = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Erreur de validation',
        errors: errors.array(),
      });
    }

    const budgetDoc = await db.collection('budgets').doc(req.params.id).get();

    if (!budgetDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Budget non trouvé',
      });
    }

    const budget = budgetDoc.data();

    if (budget.userId !== req.user.uid) {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé',
      });
    }

    const { limitAmount, month, year } = req.body;
    const updateData = {};

    if (limitAmount !== undefined) updateData.limitAmount = parseFloat(limitAmount);
    if (month !== undefined) updateData.month = parseInt(month);
    if (year !== undefined) updateData.year = parseInt(year);

    await db.collection('budgets').doc(req.params.id).update(updateData);

    const updatedBudgetDoc = await db.collection('budgets').doc(req.params.id).get();
    const updatedBudget = {
      id: updatedBudgetDoc.id,
      ...updatedBudgetDoc.data(),
    };

    res.json({
      success: true,
      budget: updatedBudget,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /budgets/{id}:
 *   delete:
 *     tags: [Budgets]
 *     summary: Supprimer un budget
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
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Budget non trouvé
 *       500:
 *         description: Erreur serveur
 */
const deleteBudget = async (req, res, next) => {
  try {
    const budgetDoc = await db.collection('budgets').doc(req.params.id).get();

    if (!budgetDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Budget non trouvé',
      });
    }

    const budget = budgetDoc.data();

    if (budget.userId !== req.user.uid) {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé',
      });
    }

    await db.collection('budgets').doc(req.params.id).delete();

    res.json({
      success: true,
      message: 'Budget supprimé avec succès',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllBudgets,
  getBudgetsWithStatus,
  createBudget,
  updateBudget,
  deleteBudget,
};

const { auth, db } = require('../config/firebase');
const { validationResult } = require('express-validator');

/**
 * @swagger
 * components:
 *   schemas:
 *     Expense:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         userId:
 *           type: string
 *         amount:
 *           type: number
 *         category:
 *           type: string
 *           enum: [alimentation, transport, sante, shopping, logement, telecom, education, autre]
 *         description:
 *           type: string
 *         operator:
 *           type: string
 *           enum: [orange_money, moov_money, wave, especes]
 *         date:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /expenses:
 *   get:
 *     tags: [Expenses]
 *     summary: Obtenir toutes les dépenses de l'utilisateur
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *         description: Mois (1-12) par defaut
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Annee par defaut
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [alimentation, transport, sante, shopping, logement, telecom, education, autre]
 *         description: Catégorie
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Recherche dans la description
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Nombre de résultats par page
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Numéro de page
 *     responses:
 *       200:
 *         description: Liste des dépenses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 expenses:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Expense'
 *                 total:
 *                   type: number
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
const getAllExpenses = async (req, res, next) => {
  try {
    const {
      month,
      year,
      category,
      search,
      limit = 50,
      page = 1,
    } = req.query;

    let query = db.collection('expenses').where('userId', '==', req.user.uid);

    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);
      query = query.where('date', '>=', startDate).where('date', '<=', endDate);
    }

    if (category) {
      query = query.where('category', '==', category);
    }

    const limitNum = parseInt(limit);
    const pageNum = parseInt(page);
    const skip = (pageNum - 1) * limitNum;

    let expensesQuery = query.orderBy('date', 'desc').limit(limitNum);
    
    // Pour la pagination, on utilise offset (Firestore)
    if (skip > 0) {
      expensesQuery = expensesQuery.offset(skip);
    }

    const expensesSnapshot = await expensesQuery.get();
    const expenses = [];
    
    expensesSnapshot.forEach(doc => {
      expenses.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    // Compter le total
    const totalSnapshot = await query.get();
    const total = totalSnapshot.size;

    res.json({
      success: true,
      expenses,
      total,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /expenses:
 *   post:
 *     tags: [Expenses]
 *     summary: Créer une nouvelle dépense
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
 *                 minimum: 1
 *               category:
 *                 type: string
 *                 enum: [alimentation, transport, sante, shopping, logement, telecom, education, autre]
 *               description:
 *                 type: string
 *                 maxLength: 200
 *               operator:
 *                 type: string
 *                 enum: [orange_money, moov_money, wave, especes]
 *                 default: especes
 *               date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Dépense créée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 expense:
 *                   $ref: '#/components/schemas/Expense'
 *       400:
 *         description: Erreur de validation
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
const createExpense = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Erreur de validation',
        errors: errors.array(),
      });
    }

    const { amount, category, description, operator, date } = req.body;

    const expenseData = {
      userId: req.user.uid,
      amount: parseFloat(amount),
      category,
      description: description || '',
      operator: operator || 'especes',
      date: date ? new Date(date) : new Date(),
      createdAt: new Date(),
    };

    const expenseRef = await db.collection('expenses').add(expenseData);
    const expense = {
      id: expenseRef.id,
      ...expenseData,
    };

    // Budget alert logic
    const expenseDate = expenseData.date;
    const month = expenseDate.getMonth() + 1;
    const year = expenseDate.getFullYear();

    const budgetSnapshot = await db.collection('budgets')
      .where('userId', '==', req.user.uid)
      .where('category', '==', category)
      .where('month', '==', month)
      .where('year', '==', year)
      .get();

    if (!budgetSnapshot.empty) {
      const budget = budgetSnapshot.docs[0].data();
      const budgetId = budgetSnapshot.docs[0].id;

      // Calculer le total dépensé ce mois pour cette catégorie
      const expensesSnapshot = await db.collection('expenses')
        .where('userId', '==', req.user.uid)
        .where('category', '==', category)
        .where('date', '>=', new Date(year, month - 1, 1))
        .where('date', '<=', new Date(year, month, 0, 23, 59, 59))
        .get();

      let totalSpent = 0;
      expensesSnapshot.forEach(doc => {
        totalSpent += doc.data().amount;
      });

      const warningThreshold = budget.limitAmount * 0.8;

      if (totalSpent >= warningThreshold && totalSpent < budget.limitAmount) {
        await db.collection('notifications').add({
          userId: req.user.uid,
          message: `⚠️ Vous avez atteint 80% de votre budget ${category} ce mois (${Math.round((totalSpent / budget.limitAmount) * 100)}%)`,
          type: 'warning',
          isRead: false,
          createdAt: new Date(),
        });
      } else if (totalSpent >= budget.limitAmount) {
        await db.collection('notifications').add({
          userId: req.user.uid,
          message: `🔴 Budget ${category} dépassé ! Limite: ${budget.limitAmount} FCFA, Dépensé: ${totalSpent} FCFA`,
          type: 'danger',
          isRead: false,
          createdAt: new Date(),
        });
      }
    }

    res.status(201).json({
      success: true,
      expense,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /expenses/{id}:
 *   get:
 *     tags: [Expenses]
 *     summary: Obtenir une dépense spécifique
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
 *         description: Dépense trouvée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 expense:
 *                   $ref: '#/components/schemas/Expense'
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Dépense non trouvée
 *       500:
 *         description: Erreur serveur
 */
const getExpenseById = async (req, res, next) => {
  try {
    const expenseDoc = await db.collection('expenses').doc(req.params.id).get();

    if (!expenseDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Dépense non trouvée',
      });
    }

    const expense = {
      id: expenseDoc.id,
      ...expenseDoc.data(),
    };

    if (expense.userId !== req.user.uid) {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé',
      });
    }

    res.json({
      success: true,
      expense,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /expenses/{id}:
 *   put:
 *     tags: [Expenses]
 *     summary: Mettre à jour une dépense
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
 *               amount:
 *                 type: number
 *                 minimum: 1
 *               category:
 *                 type: string
 *                 enum: [alimentation, transport, sante, shopping, logement, telecom, education, autre]
 *               description:
 *                 type: string
 *                 maxLength: 200
 *               operator:
 *                 type: string
 *                 enum: [orange_money, moov_money, wave, especes]
 *               date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Dépense mise à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 expense:
 *                   $ref: '#/components/schemas/Expense'
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Dépense non trouvée
 *       500:
 *         description: Erreur serveur
 */
const updateExpense = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Erreur de validation',
        errors: errors.array(),
      });
    }

    const expenseDoc = await db.collection('expenses').doc(req.params.id).get();

    if (!expenseDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Dépense non trouvée',
      });
    }

    const expense = expenseDoc.data();

    if (expense.userId !== req.user.uid) {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé',
      });
    }

    const { amount, category, description, operator, date } = req.body;
    const updateData = {};

    if (amount !== undefined) updateData.amount = parseFloat(amount);
    if (category) updateData.category = category;
    if (description !== undefined) updateData.description = description;
    if (operator) updateData.operator = operator;
    if (date) updateData.date = new Date(date);

    await db.collection('expenses').doc(req.params.id).update(updateData);

    const updatedExpenseDoc = await db.collection('expenses').doc(req.params.id).get();
    const updatedExpense = {
      id: updatedExpenseDoc.id,
      ...updatedExpenseDoc.data(),
    };

    res.json({
      success: true,
      expense: updatedExpense,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /expenses/{id}:
 *   delete:
 *     tags: [Expenses]
 *     summary: Supprimer une dépense
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
 *         description: Dépense non trouvée
 *       500:
 *         description: Erreur serveur
 */
const deleteExpense = async (req, res, next) => {
  try {
    const expenseDoc = await db.collection('expenses').doc(req.params.id).get();

    if (!expenseDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Dépense non trouvée',
      });
    }

    const expense = expenseDoc.data();

    if (expense.userId !== req.user.uid) {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé',
      });
    }

    await db.collection('expenses').doc(req.params.id).delete();

    res.json({
      success: true,
      message: 'Dépense supprimée avec succès',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllExpenses,
  createExpense,
  getExpenseById,
  updateExpense,
  deleteExpense,
};

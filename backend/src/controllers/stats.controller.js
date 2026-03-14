const { auth, db } = require('../config/firebase');

/**
 * @swagger
 * /stats/summary:
 *   get:
 *     tags: [Stats]
 *     summary: Obtenir un résumé des statistiques du mois
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
 *     responses:
 *       200:
 *         description: Résumé des statistiques
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalMonth:
 *                       type: number
 *                     totalCount:
 *                       type: integer
 *                     topCategory:
 *                       type: string
 *                     budgetCount:
 *                       type: integer
 *                     budgetUsedPercent:
 *                       type: number
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
const getSummary = async (req, res, next) => {
  try {
    const now = new Date();
    const month = req.query.month ? parseInt(req.query.month) : now.getMonth() + 1;
    const year = req.query.year ? parseInt(req.query.year) : now.getFullYear();

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    // Total dépensé ce mois et nombre de transactions
    const expensesSnapshot = await db.collection('expenses')
      .where('userId', '==', req.user.uid)
      .where('date', '>=', startDate)
      .where('date', '<=', endDate)
      .get();

    let totalMonth = 0;
    let totalCount = 0;
    const categoryTotals = {};

    expensesSnapshot.forEach(doc => {
      const expense = doc.data();
      totalMonth += expense.amount;
      totalCount++;
      
      if (!categoryTotals[expense.category]) {
        categoryTotals[expense.category] = 0;
      }
      categoryTotals[expense.category] += expense.amount;
    });

    // Catégorie avec plus de dépenses
    let topCategory = null;
    let maxAmount = 0;
    for (const [category, amount] of Object.entries(categoryTotals)) {
      if (amount > maxAmount) {
        maxAmount = amount;
        topCategory = category;
      }
    }

    // Nombre de budgets actifs
    const budgetsSnapshot = await db.collection('budgets')
      .where('userId', '==', req.user.uid)
      .where('month', '==', month)
      .where('year', '==', year)
      .get();

    const budgetCount = budgetsSnapshot.size;

    // Pourcentage moyen utilisé des budgets
    let budgetUsedPercent = 0;
    if (budgetCount > 0) {
      const budgetsWithSpending = await Promise.all(
        budgetsSnapshot.docs.map(async (budgetDoc) => {
          const budget = budgetDoc.data();
          
          const categoryExpensesSnapshot = await db.collection('expenses')
            .where('userId', '==', req.user.uid)
            .where('category', '==', budget.category)
            .where('date', '>=', startDate)
            .where('date', '<=', endDate)
            .get();

          let spent = 0;
          categoryExpensesSnapshot.forEach(doc => {
            spent += doc.data().amount;
          });

          return budget.limitAmount > 0 ? (spent / budget.limitAmount) * 100 : 0;
        })
      );

      budgetUsedPercent = budgetsWithSpending.reduce((sum, percent) => sum + percent, 0) / budgetsWithSpending.length;
    }

    res.json({
      success: true,
      data: {
        totalMonth,
        totalCount,
        topCategory,
        budgetCount,
        budgetUsedPercent: Math.round(budgetUsedPercent * 100) / 100,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /stats/monthly:
 *   get:
 *     tags: [Stats]
 *     summary: Obtenir les statistiques des 6 derniers mois
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistiques mensuelles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       month:
 *                         type: string
 *                       year:
 *                         type: integer
 *                       total:
 *                         type: number
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
const getMonthly = async (req, res, next) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const expensesSnapshot = await db.collection('expenses')
      .where('userId', '==', req.user.uid)
      .where('date', '>=', sixMonthsAgo)
      .get();

    const monthNames = [
      'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin',
      'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc',
    ];

    const monthlyData = {};

    expensesSnapshot.forEach(doc => {
      const expense = doc.data();
      const date = new Date(expense.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: monthNames[date.getMonth()],
          year: date.getFullYear(),
          total: 0,
        };
      }
      
      monthlyData[monthKey].total += expense.amount;
    });

    const data = Object.values(monthlyData).sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return monthNames.indexOf(a.month) - monthNames.indexOf(b.month);
    });

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /stats/categories:
 *   get:
 *     tags: [Stats]
 *     summary: Obtenir les statistiques par catégorie
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
 *     responses:
 *       200:
 *         description: Statistiques par catégorie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       total:
 *                         type: number
 *                       count:
 *                         type: integer
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
const getByCategories = async (req, res, next) => {
  try {
    const now = new Date();
    const month = req.query.month ? parseInt(req.query.month) : now.getMonth() + 1;
    const year = req.query.year ? parseInt(req.query.year) : now.getFullYear();

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const expensesSnapshot = await db.collection('expenses')
      .where('userId', '==', req.user.uid)
      .where('date', '>=', startDate)
      .where('date', '<=', endDate)
      .get();

    const categoryStats = {};

    expensesSnapshot.forEach(doc => {
      const expense = doc.data();
      
      if (!categoryStats[expense.category]) {
        categoryStats[expense.category] = {
          _id: expense.category,
          total: 0,
          count: 0,
        };
      }
      
      categoryStats[expense.category].total += expense.amount;
      categoryStats[expense.category].count++;
    });

    const data = Object.values(categoryStats).sort((a, b) => b.total - a.total);

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /stats/daily:
 *   get:
 *     tags: [Stats]
 *     summary: Obtenir les statistiques quotidiennes du mois
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
 *     responses:
 *       200:
 *         description: Statistiques quotidiennes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       day:
 *                         type: integer
 *                       total:
 *                         type: number
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
const getDaily = async (req, res, next) => {
  try {
    const now = new Date();
    const month = req.query.month ? parseInt(req.query.month) : now.getMonth() + 1;
    const year = req.query.year ? parseInt(req.query.year) : now.getFullYear();

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const expensesSnapshot = await db.collection('expenses')
      .where('userId', '==', req.user.uid)
      .where('date', '>=', startDate)
      .where('date', '<=', endDate)
      .get();

    const dailyData = {};

    expensesSnapshot.forEach(doc => {
      const expense = doc.data();
      const date = new Date(expense.date);
      const day = date.getDate();
      
      if (!dailyData[day]) {
        dailyData[day] = {
          day,
          total: 0,
        };
      }
      
      dailyData[day].total += expense.amount;
    });

    const data = Object.values(dailyData).sort((a, b) => a.day - b.day);

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSummary,
  getMonthly,
  getByCategories,
  getDaily,
};

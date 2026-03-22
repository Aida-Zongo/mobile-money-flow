const Budget = require('../models/Budget');
const Expense = require('../models/Expense');

const getBudgetsWithStatus = async (req, res) => {
  try {
    const { uid } = req.user;
    const budgets = await Budget.find(
      { userId: uid }
    );

    const result = await Promise.all(
      budgets.map(async (b) => {
        const agg = await Expense.aggregate([
          {
            $match: {
              userId: uid,
              category: b.category,
              date: {
                $gte: new Date(
                  b.year, b.month - 1, 1),
                $lte: new Date(
                  b.year, b.month, 0, 23, 59, 59)
              }
            }
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$amount' }
            }
          }
        ]);

        const spent = agg[0]?.total || 0;
        const percent = Math.round(
          (spent / b.limitAmount) * 100
        );

        return {
          id: b._id.toString(),
          category: b.category,
          limitAmount: b.limitAmount,
          month: b.month,
          year: b.year,
          spent,
          percent
        };
      })
    );

    return res.json({
      success: true, budgets: result
    });
  } catch (error) {
    return res.status(500).json({
      success: false, message: error.message
    });
  }
};

const createBudget = async (req, res) => {
  try {
    const { uid } = req.user;
    const { category, limitAmount, month, year }
      = req.body;

    const existing = await Budget.findOne({
      userId: uid,
      category,
      month: Number(month),
      year: Number(year)
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message:
          'Budget déjà existant pour ' +
          'cette catégorie ce mois'
      });
    }

    const budget = await Budget.create({
      userId: uid,
      category,
      limitAmount: Number(limitAmount),
      month: Number(month),
      year: Number(year)
    });

    return res.status(201).json({
      success: true,
      budget: {
        id: budget._id.toString(),
        ...budget.toObject()
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false, message: error.message
    });
  }
};

const updateBudget = async (req, res) => {
  try {
    const { uid } = req.user;
    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, userId: uid },
      {
        limitAmount: req.body.limitAmount,
        month: req.body.month,
        year: req.body.year
      },
      { new: true }
    );
    return res.json({
      success: true,
      budget: {
        id: budget._id.toString(),
        ...budget.toObject()
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false, message: error.message
    });
  }
};

const deleteBudget = async (req, res) => {
  try {
    const { uid } = req.user;
    await Budget.findOneAndDelete(
      { _id: req.params.id, userId: uid }
    );
    return res.json({
      success: true,
      message: 'Budget supprimé'
    });
  } catch (error) {
    return res.status(500).json({
      success: false, message: error.message
    });
  }
};

module.exports = {
  getBudgetsWithStatus, createBudget,
  updateBudget, deleteBudget
};

const Expense = require('../models/Expense');
const Budget = require('../models/Budget');
const Notification =
  require('../models/Notification');

const getExpenses = async (req, res) => {
  try {
    const { uid } = req.user;
    const { month, year, category } = req.query;

    const filter = { userId: uid };

    if (month && year) {
      const m = Number(month);
      const y = Number(year);
      filter.date = {
        $gte: new Date(y, m - 1, 1),
        $lte: new Date(y, m, 0, 23, 59, 59)
      };
    }

    if (category) filter.category = category;

    const expenses = await Expense
      .find(filter)
      .sort({ date: -1 });

    return res.json({
      success: true,
      expenses: expenses.map(formatExpense)
    });
  } catch (error) {
    return res.status(500).json({
      success: false, message: error.message
    });
  }
};

const createExpense = async (req, res) => {
  try {
    const { uid } = req.user;
    const {
      amount, category, description,
      operator, date
    } = req.body;

    if (!amount || !category) {
      return res.status(400).json({
        success: false,
        message: 'amount et category requis'
      });
    }

    const expense = await Expense.create({
      userId: uid,
      amount: Number(amount),
      category,
      description: description || '',
      operator: operator || 'especes',
      date: date ? new Date(date) : new Date()
    });

    // Vérifie alertes budget
    await checkBudget(uid, category, expense.date);

    return res.status(201).json({
      success: true,
      expense: formatExpense(expense)
    });
  } catch (error) {
    return res.status(500).json({
      success: false, message: error.message
    });
  }
};

const updateExpense = async (req, res) => {
  try {
    const { uid } = req.user;
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: uid },
      {
        amount: req.body.amount,
        category: req.body.category,
        description: req.body.description,
        operator: req.body.operator,
        date: req.body.date
          ? new Date(req.body.date) : undefined
      },
      { new: true, runValidators: true }
    );

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Dépense non trouvée'
      });
    }

    return res.json({
      success: true,
      expense: formatExpense(expense)
    });
  } catch (error) {
    return res.status(500).json({
      success: false, message: error.message
    });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const { uid } = req.user;
    await Expense.findOneAndDelete(
      { _id: req.params.id, userId: uid }
    );
    return res.json({
      success: true,
      message: 'Dépense supprimée'
    });
  } catch (error) {
    return res.status(500).json({
      success: false, message: error.message
    });
  }
};

const checkBudget = async (
  userId, category, date
) => {
  try {
    const d = new Date(date);
    const month = d.getMonth() + 1;
    const year = d.getFullYear();

    const budget = await Budget.findOne({
      userId, category, month, year
    });
    if (!budget) return;

    const result = await Expense.aggregate([
      {
        $match: {
          userId, category,
          date: {
            $gte: new Date(year, month-1, 1),
            $lte: new Date(
              year, month, 0, 23, 59, 59)
          }
        }
      },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const spent = result[0]?.total || 0;
    const percent = Math.round(
      (spent / budget.limitAmount) * 100
    );

    console.log(
      `Budget check: ${category} = ${percent}%`
    );

    // Crée notification si >= 80%
    if (percent >= 80) {
      const Notification =
        require('../models/Notification');

      // Évite les doublons
      const existing =
        await Notification.findOne({
          userId, isRead: false,
          message: { $regex: category },
          createdAt: {
            $gte: new Date(
              Date.now() - 60 * 60 * 1000
            )
          }
        });

      if (!existing) {
        await Notification.create({
          userId,
          message: percent >= 100
            ? `🔴 Budget ${category} dépassé ! (${percent}% utilisé)`
            : `🟡 Budget ${category} à ${percent}% — Attention !`,
          type: percent >= 100
            ? 'danger' : 'warning',
          isRead: false,
        });
        console.log(
          `✅ Notification créée: ${category} ${percent}%`
        );
      }
    }
  } catch(e) {
    console.error('checkBudget error:', e);
  }
};

const formatExpense = (e) => ({
  id: e._id.toString(),
  userId: e.userId,
  amount: e.amount,
  category: e.category,
  description: e.description,
  operator: e.operator,
  date: e.date,
  createdAt: e.createdAt,
});

module.exports = {
  getExpenses, createExpense,
  updateExpense, deleteExpense
};

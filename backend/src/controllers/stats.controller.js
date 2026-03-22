const Expense = require('../models/Expense');
const Budget = require('../models/Budget');

const getSummary = async (req, res) => {
  try {
    const { uid } = req.user;
    const month = Number(req.query.month) ||
      new Date().getMonth() + 1;
    const year = Number(req.query.year) ||
      new Date().getFullYear();

    const start = new Date(year, month - 1, 1);
    const end = new Date(
      year, month, 0, 23, 59, 59);

    const [totalAgg, catAgg, budgetCount] =
      await Promise.all([
        Expense.aggregate([
          {
            $match: {
              userId: uid,
              date: { $gte: start, $lte: end }
            }
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$amount' },
              count: { $sum: 1 }
            }
          }
        ]),
        Expense.aggregate([
          {
            $match: {
              userId: uid,
              date: { $gte: start, $lte: end }
            }
          },
          {
            $group: {
              _id: '$category',
              total: { $sum: '$amount' }
            }
          },
          { $sort: { total: -1 } },
          { $limit: 1 }
        ]),
        Budget.countDocuments({
          userId: uid, month, year
        })
      ]);

    const totalMonth = totalAgg[0]?.total || 0;
    const totalCount = totalAgg[0]?.count || 0;
    const topCategory = catAgg[0]?._id || null;

    let budgetUsedPercent = 0;
    if (budgetCount > 0) {
      const budgets = await Budget.find(
        { userId: uid, month, year }
      );
      const totalLimit = budgets.reduce(
        (s, b) => s + b.limitAmount, 0
      );
      budgetUsedPercent = totalLimit > 0
        ? Math.round(
          (totalMonth / totalLimit) * 100
        )
        : 0;
    }

    return res.json({
      success: true,
      totalMonth,
      totalCount,
      topCategory,
      budgetCount,
      budgetUsedPercent
    });
  } catch (error) {
    return res.status(500).json({
      success: false, message: error.message
    });
  }
};

const getCategories = async (req, res) => {
  try {
    const { uid } = req.user;
    const month = Number(req.query.month) ||
      new Date().getMonth() + 1;
    const year = Number(req.query.year) ||
      new Date().getFullYear();

    const data = await Expense.aggregate([
      {
        $match: {
          userId: uid,
          date: {
            $gte: new Date(year, month - 1, 1),
            $lte: new Date(
              year, month, 0, 23, 59, 59)
          }
        }
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' }
        }
      },
      { $sort: { total: -1 } }
    ]);

    return res.json({ success: true, data });
  } catch (error) {
    return res.status(500).json({
      success: false, message: error.message
    });
  }
};

const getDaily = async (req, res) => {
  try {
    const { uid } = req.user;
    const month = Number(req.query.month) ||
      new Date().getMonth() + 1;
    const year = Number(req.query.year) ||
      new Date().getFullYear();

    const data = await Expense.aggregate([
      {
        $match: {
          userId: uid,
          date: {
            $gte: new Date(year, month - 1, 1),
            $lte: new Date(
              year, month, 0, 23, 59, 59)
          }
        }
      },
      {
        $group: {
          _id: { $dayOfMonth: '$date' },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          day: '$_id',
          total: 1,
          _id: 0
        }
      }
    ]);

    return res.json({ success: true, data });
  } catch (error) {
    return res.status(500).json({
      success: false, message: error.message
    });
  }
};

const getMonthly = async (req, res) => {
  try {
    const { uid } = req.user;
    const year = Number(req.query.year) ||
      new Date().getFullYear();

    const data = await Expense.aggregate([
      {
        $match: {
          userId: uid,
          date: {
            $gte: new Date(year, 0, 1),
            $lte: new Date(year, 11, 31, 23, 59, 59)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$date' },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          month: '$_id',
          total: 1,
          _id: 0
        }
      }
    ]);

    return res.json({ success: true, data });
  } catch (error) {
    return res.status(500).json({
      success: false, message: error.message
    });
  }
};

module.exports = {
  getSummary, getCategories,
  getDaily, getMonthly
};

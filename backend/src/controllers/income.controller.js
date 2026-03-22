const Income = require('../models/Income');

const getIncomes = async (req, res) => {
    try {
        const { uid } = req.user;
        const { month, year } = req.query;

        const filter = { userId: uid };
        if (month) filter.month = Number(month);
        if (year) filter.year = Number(year);

        const incomes = await Income
            .find(filter)
            .sort({ createdAt: -1 });

        const total = incomes.reduce(
            (sum, i) => sum + i.amount, 0
        );

        return res.json({
            success: true,
            incomes: incomes.map(i => ({
                id: i._id.toString(),
                userId: i.userId,
                amount: i.amount,
                source: i.source,
                month: i.month,
                year: i.year,
                note: i.note,
                createdAt: i.createdAt,
            })),
            total
        });
    } catch (error) {
        return res.status(500).json({
            success: false, message: error.message
        });
    }
};

const createIncome = async (req, res) => {
    try {
        const { uid } = req.user;
        const { amount, source, month, year, note }
            = req.body;

        if (!amount || !source) {
            return res.status(400).json({
                success: false,
                message: 'amount et source requis'
            });
        }

        const income = await Income.create({
            userId: uid,
            amount: Number(amount),
            source,
            month: Number(month) ||
                new Date().getMonth() + 1,
            year: Number(year) ||
                new Date().getFullYear(),
            note: note || ''
        });

        return res.status(201).json({
            success: true,
            income: {
                id: income._id.toString(),
                ...income.toObject()
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false, message: error.message
        });
    }
};

const deleteIncome = async (req, res) => {
    try {
        const { uid } = req.user;
        await Income.findOneAndDelete(
            { _id: req.params.id, userId: uid }
        );
        return res.json({
            success: true,
            message: 'Revenu supprimé'
        });
    } catch (error) {
        return res.status(500).json({
            success: false, message: error.message
        });
    }
};

module.exports = {
    getIncomes, createIncome, deleteIncome
};

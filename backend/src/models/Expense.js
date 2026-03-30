const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    amount: { type: Number, required: true },
    category: {
        type: String,
        default: 'autre'
    },
    description: { type: String, default: '' },
    operator: {
        type: String,
        enum: [
            'orange_money', 'wave',
            'moov_money', 'especes'
        ],
        default: 'especes'
    },
    date: { type: Date, default: Date.now },
}, { timestamps: true });

// Index composé pour améliorer les performances des classements et du dashboard
expenseSchema.index({ userId: 1, date: -1 });
expenseSchema.index({ userId: 1, category: 1, date: -1 });

module.exports =
    mongoose.model('Expense', expenseSchema);

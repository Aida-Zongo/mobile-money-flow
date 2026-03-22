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
        enum: [
            'alimentation', 'transport', 'sante',
            'shopping', 'logement', 'telecom',
            'education', 'autre'
        ],
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

module.exports =
    mongoose.model('Expense', expenseSchema);

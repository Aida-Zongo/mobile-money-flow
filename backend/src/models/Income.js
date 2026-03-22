const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    amount: { type: Number, required: true },
    source: {
        type: String,
        enum: [
            'salaire', 'freelance', 'commerce',
            'famille', 'autre'
        ],
        default: 'autre'
    },
    month: { type: Number, required: true },
    year: { type: Number, required: true },
    note: { type: String, default: '' },
}, { timestamps: true });

module.exports =
    mongoose.model('Income', incomeSchema);

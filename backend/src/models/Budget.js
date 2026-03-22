const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    category: { type: String, required: true },
    limitAmount: { type: Number, required: true },
    month: { type: Number, required: true },
    year: { type: Number, required: true },
}, { timestamps: true });

// Index unique : un seul budget par catégorie/mois
budgetSchema.index(
    { userId: 1, category: 1, month: 1, year: 1 },
    { unique: true }
);

module.exports =
    mongoose.model('Budget', budgetSchema);

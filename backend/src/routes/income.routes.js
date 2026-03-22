const express = require('express');
const {
    getIncomes,
    createIncome,
    deleteIncome,
} = require('../controllers/income.controller');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Routes (toutes protégées)
router.use(verifyToken);

router.get('/', getIncomes);
router.post('/', createIncome);
router.delete('/:id', deleteIncome);

module.exports = router;

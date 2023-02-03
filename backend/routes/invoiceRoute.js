const express = require('express');
const router = express.Router();
const { getInvoice, setInvoice } = require('../controllers/invoiceController');

const { protect } = require('../middleware/authMiddleware');

// router.route('/').get(protect, getGoals).post(protect, setGoal);
// router.route('/:id').delete(protect, deleteGoal).put(protect, updateGoal);
router.route('/:id').get(getInvoice);
router.route('/set/:id').post(setInvoice);

module.exports = router;

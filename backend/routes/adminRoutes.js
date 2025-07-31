const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

router.get('/dashboard', adminController.getDashboard);
router.get('/farmers', adminController.getFarmers);
router.patch('/farmers/:id/block', adminController.toggleBlock);
router.delete('/farmers/:id', adminController.deleteFarmer);

module.exports = router;

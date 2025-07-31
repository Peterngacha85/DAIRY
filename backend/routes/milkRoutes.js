const express = require('express');
const router = express.Router();
const milkController = require('../controllers/milkController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.post('/', milkController.createMilk);
router.get('/', milkController.getMilkRecords);
router.put('/:id', milkController.updateMilk);
router.delete('/:id', milkController.deleteMilk);

module.exports = router;

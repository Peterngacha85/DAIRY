const express = require('express');
const router = express.Router();
const healthController = require('../controllers/healthController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.post('/', healthController.createHealth);
router.get('/', healthController.getHealthRecords);
router.put('/:id', healthController.updateHealth);
router.delete('/:id', healthController.deleteHealth);

module.exports = router;

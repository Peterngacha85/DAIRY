const express = require('express');
const router = express.Router();
const feedController = require('../controllers/feedController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.post('/', feedController.createFeed);
router.get('/', feedController.getFeeds);
router.put('/:id', feedController.updateFeed);
router.delete('/:id', feedController.deleteFeed);

module.exports = router;

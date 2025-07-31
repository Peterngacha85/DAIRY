const express = require('express');
const router = express.Router();
const breedController = require('../controllers/breedController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.post('/', breedController.createBreed);
router.get('/', breedController.getBreeds);
router.put('/:id', breedController.updateBreed);
router.delete('/:id', breedController.deleteBreed);

module.exports = router;

const express = require('express');
const router = express.Router();
const ImageController = require('../controllers/imageController.js');

router.get('/:image', ImageController.get_image_by_name);

module.exports = router;
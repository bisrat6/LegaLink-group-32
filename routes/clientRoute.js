const express = require('express');
const clientController = require('../controllers/clientController');

const router = express.Router();

// Specific routes must come before parameterized routes
router.route('/').patch(clientController.updateClient);
router.route('/:id').get(clientController.getClient);

module.exports = router;

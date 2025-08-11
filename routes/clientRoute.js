const express = require('express');
const clientController = require('../controllers/clientController');

const router = express.Router();

router.route('/:id').get(clientController.getClient);
router.route('/').patch(clientController.updateClient);

module.exports = router;

const express = require('express');
const clientController = require('../controllers/clientController');

const router = express.Router();

router
  .route('/:id')
  .get(clientController.getClient)
  .patch(clientController.updateClient);

router.route('/').post(clientController.createClientProfile);

module.exports = router;

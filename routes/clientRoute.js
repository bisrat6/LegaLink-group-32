const express = require('express');
const clientController = require('../controllers/clientController');
const userValidation = require('../middleware/userValidation');
const lawyerValidation = require('../middleware/lawyerValidation');

const router = express.Router();

// Specific routes must come before parameterized routes
router
  .route('/')
  .patch(lawyerValidation.validateUserUpdate, clientController.updateClient);
router
  .route('/:id')
  .get(userValidation.validateIdParam('id'), clientController.getClient);
module.exports = router;

const express = require('express');
const clientController = require('../controllers/clientController');
const userValidation = require('../middleware/userValidation');
const lawyerValidation = require('../middleware/lawyerValidation');
const authController = require('../controllers/authController');

const router = express.Router();

// Specific routes must come before parameterized routes
router
  .route('/')
  .patch(
    authController.protect,
    authController.restrictTo('client'),
    lawyerValidation.validateUserUpdate,
    clientController.updateClient,
  );
router
  .route('/:id')
  .get(
    authController.protect,
    authController.restrictTo('lawyer'),
    userValidation.validateIdParam('id'),
    clientController.getClient,
  );
module.exports = router;

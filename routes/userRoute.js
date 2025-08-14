const express = require('express');

const userController = require('../controllers/userController');

const userValidation = require('../middleware/userValidation');

const router = express.Router();

router
  .route('/')
  .post(userValidation.validateUserRequired, userController.createAccount)
  .get(userController.getProfile);

module.exports = router;

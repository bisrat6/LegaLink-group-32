const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const userValidation = require('../middleware/userValidation');

const router = express.Router();

router.route('/').get(authController.protect, userController.getProfile);

router.post(
  '/signup',
  userValidation.validateUserRequired,
  userValidation.encryptPassword,
  authController.signup,
);
router.post('/login', authController.loginAccount);
router.post('/forgotPassword', authController.forgotPassword);
router.patch(
  '/resetPassword/:token',
  userValidation.validateUserPassword,
  userValidation.encryptPassword,
  authController.resetPassword,
);
router
  .route('/updatePassword')
  .patch(authController.protect, authController.updatePassword);

router.delete('/deleteMe', authController.protect, authController.deleteMe);
module.exports = router;

const express = require('express');
const authController = require('../controllers/authController');
const applicationController = require('../controllers/applicationController');

const router = express.Router();

router
  .route('/lawyer/applications')
  .get(
    authController.protect,
    authController.restrictTo('lawyer'),
    applicationController.getApplicationBylawer,
  );
router
  .route('/cases/:caseId/applications')
  .get(
    authController.protect,
    authController.restrictTo('client'),
    applicationController.getAllApplication,
  )
  .post(
    authController.protect,
    authController.restrictTo('lawyer'),
    applicationController.ApplyApplication,
  );

router
  .route('/applications/:applicationId')
  .patch(
    authController.protect,
    authController.restrictTo('client', 'admin'),
    applicationController.AcceptApplication,
  );

router
  .route('/applications/:applicationId/reject')
  .patch(
    authController.protect,
    authController.restrictTo('client', 'admin'),
    applicationController.rejectApplication,
  );

module.exports = router;

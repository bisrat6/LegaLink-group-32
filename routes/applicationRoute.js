const express = require('express');

const applicationController = require('../controllers/applicationController');

const router = express.Router();

router
  .route('/cases/:caseId/applications')
  .get(applicationController.getAllApplication)
  .post(applicationController.ApplyApplication);

router
  .route('/lawyers/:lawyerId/applications')
  .get(applicationController.getApplicationBylawer);

router
  .route('/applications/:applicationId')
  .patch(applicationController.AcceptApplication);

router
  .route('/applications/:applicationId/reject')
  .patch(applicationController.rejectApplication);

module.exports = router;

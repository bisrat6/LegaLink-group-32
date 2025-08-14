const query = require('../models/applicationModel');
const catchAsync = require('../utils/catchAsync');

// 1. Apply to a Case (Lawyer applies)
// POST /cases/:caseId/applications

// Body: { message: string } (optional message from lawyer)

// Action: Lawyer applies to the client’s case

// 2. Get All Applications for a Case (Client/admin view)
// GET /cases/:caseId/applications

// Action: Fetch all lawyer applications for a specific case

// 3. Get All Applications by a Lawyer
// GET /lawyers/:lawyerId/applications

// Action: Lawyer fetches all their applications

// 4. Get Details of a Specific Application
// GET /applications/:applicationId

// Action: Fetch details of one application (could be for client or lawyer)

// 5. Update Application Status (Client/admin approves/rejects)
// PATCH /applications/:applicationId

// Body: { status: "approved" | "rejected" | "withdrawn" }

// Action: Update the status of an application

// 6. Withdraw Application (Lawyer cancels application)
// DELETE /applications/:applicationId

// Action: Lawyer withdraws their application

//get all applications from lawyers to a client applied for the case
exports.getAllApplication = catchAsync(async (req, res) => {
  const caseId = req.params.caseId * 1;
  const applications = await query.getAllApplications(caseId, req.query);
  res.status(200).json({
    status: 'success',
    data: {
      applications,
    },
  });
});

//lawyers apply for cases
exports.ApplyApplication = catchAsync(async (req, res) => {
  const lawyerId = 7; //later change to req.user.id
  const caseId = req.params.caseId * 1;
  const application = await query.applyApplication(caseId, lawyerId, req.body);
  res.status(201).json({
    status: 'success',
    data: {
      application,
    },
  });
});

//lawyers get all applications
exports.getApplicationBylawer = catchAsync(async (req, res) => {
  const lawyerId = req.params.lawyerId * 1;
  const applications = await query.getApplicationsByLawyer(lawyerId, req.query);
  res.status(200).json({
    status: 'success',
    data: {
      applications,
    },
  });
});

// acceptance to the lawyer
exports.AcceptApplication = catchAsync(async (req, res) => {
  const applicationId = req.params.applicationId * 1;
  const application = await query.acceptApplication(applicationId);
  res.status(200).json({
    status: 'success',
    data: {
      application,
    },
    message: 'Your application is accepted!',
  });
});

exports.rejectApplication = catchAsync(async (req, res) => {
  const applicationId = req.params.applicationId * 1;
  const application = await query.rejectApplication(applicationId);
  res.status(200).json({
    status: 'success',
    data: { application },
  });
});

const query = require('../models/applicationModel');

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

//get all applications from lawyers applied for the case
exports.getAllApplication = async (req, res) => {
  const caseId = req.params.caseId * 1;
  try {
    const applications = await query.getAllApplications(caseId, req.query);
    res.status(200).json({
      status: 'success',
      data: {
        applications,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'This route is not defined',
    });
  }
};

//lawyers apply for cases
exports.ApplyApplication = async (req, res) => {
  const lawyerId = 7; //later change to req.user.id
  const caseId = req.params.caseId * 1;
  try {
    const application = await query.applyApplication(
      caseId,
      lawyerId,
      req.body,
    );
    res.status(201).json({
      status: 'success',
      data: {
        application,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'This route is not defined',
    });
  }
};

//lawyers get all applications for a case
exports.getApplicationBylawer = async (req, res) => {
  const lawyerId = req.params.lawyerId * 1;
  try {
    const applications = await query.getApplicationsByLawyer(
      lawyerId,
      req.query,
    );
    res.status(200).json({
      status: 'success',
      data: {
        applications,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'This route is not defined',
    });
  }
};

// acceptance to the lawyer
exports.AcceptApplication = async (req, res) => {
  const applicationId = req.params.applicationId * 1;
  try {
    const application = await query.acceptApplication(applicationId);
    res.status(200).json({
      status: 'success',
      data: {
        application,
      },
      message: 'Your application is accepted!',
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      status: 'error',
      message: 'This route is not defined',
    });
  }
};

exports.rejectApplication = async (req, res) => {
  const applicationId = req.params.applicationId * 1;
  try {
    const application = await query.rejectApplication(applicationId);
    res.status(200).json({
      status: 'success',
      data: { application },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Could not reject application',
    });
  }
};

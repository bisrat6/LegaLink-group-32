# Case Middleware Usage Guide

This document explains how to use the new middleware system for case operations in the Legal Link application.

## 🏗️ **Middleware Architecture**

The case validation and authorization is now properly separated into middleware layers:

1. **Input Validation** (`caseValidation.js`) - Validates request data
2. **Data Fetching** (`caseData.js`) - Fetches case data from database
3. **Authorization** (`caseAuthorization.js`) - Checks user permissions
4. **Business Logic** - Enforced at database level with triggers

## 📋 **Available Middleware Functions**

### **Input Validation (`caseValidation.js`)**
- `validateCaseQuery` - Validates query parameters for case listing
- `validatePostCase` - Validates case creation data
- `validateUpdateCase` - Validates case update data
- `validateReview` - Validates review submission data
- `validateCaseId` - Validates case ID parameter
- `authorizeCaseAccess` - Basic authorization check

### **Data Fetching (`caseData.js`)**
- `fetchCaseData` - Fetches complete case data with client info
- `fetchCaseForApplication` - Fetches basic case data for applications
- `caseExists` - Simple existence check
- `fetchCaseBasic` - Fetches minimal case data

### **Authorization (`caseAuthorization.js`)**
- `canAccessCase` - Checks if user can view case
- `canUpdateCase` - Checks if user can update case
- `canDeleteCase` - Checks if user can delete case
- `canReviewCase` - Checks if user can review case
- `canApplyToCase` - Checks if lawyer can apply to case
- `canManageApplications` - Checks if user can manage applications

## 🔄 **Middleware Chain Examples**

### **1. Get Case Details**
```javascript
// Route: GET /api/cases/:caseId
router.get('/:caseId',
  auth.requireAuth,                    // Authentication
  caseValidation.validateCaseId,       // Validate case ID
  caseData.fetchCaseData,              // Fetch case data
  caseAuthorization.canAccessCase,     // Check access permission
  caseController.getCase               // Controller action
);
```

### **2. Create New Case**
```javascript
// Route: POST /api/cases
router.post('/',
  auth.requireAuth,                    // Authentication
  caseValidation.authorizeCaseAccess('create'), // Check role
  caseValidation.validatePostCase,     // Validate input data
  caseController.postCase              // Controller action
);
```

### **3. Update Case**
```javascript
// Route: PUT /api/cases/:caseId
router.put('/:caseId',
  auth.requireAuth,                    // Authentication
  caseValidation.validateCaseId,       // Validate case ID
  caseValidation.validateUpdateCase,   // Validate update data
  caseData.fetchCaseData,              // Fetch case data
  caseAuthorization.canUpdateCase,     // Check update permission
  caseValidation.validateStatusTransition, // Validate status change
  caseController.updateCase            // Controller action
);
```

### **4. Delete Case**
```javascript
// Route: DELETE /api/cases/:caseId
router.delete('/:caseId',
  auth.requireAuth,                    // Authentication
  caseValidation.validateCaseId,       // Validate case ID
  caseData.fetchCaseData,              // Fetch case data
  caseAuthorization.canDeleteCase,     // Check delete permission
  caseAuthorization.isCaseDeletable,   // Check business rules
  caseController.deleteCase            // Controller action
);
```

### **5. Submit Review**
```javascript
// Route: POST /api/cases/:caseId/reviews
router.post('/:caseId/reviews',
  auth.requireAuth,                    // Authentication
  caseValidation.validateCaseId,       // Validate case ID
  caseValidation.validateReview,       // Validate review data
  caseData.fetchCaseBasic,             // Fetch basic case data
  caseAuthorization.canReviewCase,     // Check review permission
  caseController.postReview            // Controller action
);
```

### **6. Apply to Case**
```javascript
// Route: POST /api/cases/:caseId/applications
router.post('/:caseId/applications',
  auth.requireAuth,                    // Authentication
  caseValidation.validateCaseId,       // Validate case ID
  caseData.fetchCaseForApplication,    // Fetch case data
  caseAuthorization.canApplyToCase,    // Check application permission
  applicationController.applyApplication // Controller action
);
```

## 🎯 **Controller Updates Required**

Your controllers now need to be updated to work with the middleware system:

### **Before (Old Way)**
```javascript
// Old controller - handled everything
exports.postCase = async (req, res, next) => {
  try {
    const { userId, userRole } = req.user;
    const { clientId } = req.body;
    
    // Validation and authorization mixed with business logic
    if (userRole !== 'client') {
      return res.status(403).json({ message: 'Only clients can create cases' });
    }
    
    // ... more validation and business logic
    
    const result = await caseModel.postCase(clientId, req.body, userId, userRole);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};
```

### **After (New Way)**
```javascript
// New controller - focused on business logic only
exports.postCase = async (req, res, next) => {
  try {
    const { userId } = req.user;
    
    // Middleware has already validated and authorized
    const result = await caseModel.postCase(userId, req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};
```

## 🔒 **Security Benefits**

### **Separation of Concerns**
- **Validation**: Handled by Joi schemas in middleware
- **Authorization**: Handled by dedicated middleware functions
- **Business Logic**: Handled by models and database triggers
- **Data Fetching**: Handled by specialized middleware

### **Input Validation**
- All input is validated before reaching controllers
- SQL injection prevention through field validation
- Consistent error messages across the application
- Data sanitization (trimming, type checking)

### **Authorization**
- Centralized permission checking
- Role-based access control
- Case ownership validation
- Business rule enforcement

## 📝 **Implementation Steps**

### **Step 1: Update Routes**
Replace your existing case routes with the new middleware chain pattern shown above.

### **Step 2: Update Controllers**
Simplify controllers to focus only on business logic, removing validation and authorization code.

### **Step 3: Test Middleware**
Verify that all middleware functions work correctly with your existing data.

### **Step 4: Update Error Handling**
Ensure your error handling middleware works with the new AppError system.

## 🧪 **Testing Middleware**

### **Unit Tests**
```javascript
// Test validation middleware
describe('Case Validation', () => {
  it('should validate valid case data', () => {
    const req = { body: validCaseData };
    const res = mockResponse();
    const next = jest.fn();
    
    validatePostCase(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
```

### **Integration Tests**
```javascript
// Test complete middleware chain
describe('Case Routes', () => {
  it('should create case with valid data and authorization', async () => {
    const response = await request(app)
      .post('/api/cases')
      .set('Authorization', `Bearer ${clientToken}`)
      .send(validCaseData);
    
    expect(response.status).toBe(201);
  });
});
```

## 🚀 **Performance Benefits**

- **Reduced Database Queries**: Case data fetched once and reused
- **Efficient Validation**: Joi validation is fast and lightweight
- **Cached Authorization**: Permission checks use cached case data
- **Database Triggers**: Business logic enforced at database level

## 📚 **Additional Resources**

- See `caseValidation.js` for all validation schemas
- See `caseAuthorization.js` for all permission checks
- See `caseData.js` for data fetching patterns
- See `caseModel.js` for simplified business logic

---

**Note**: This middleware system provides a clean, secure, and maintainable way to handle case operations while keeping your controllers focused on business logic.

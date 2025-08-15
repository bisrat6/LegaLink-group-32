# Database Fixes and Improvements

This document outlines all the critical database issues that have been identified and fixed in the Legal Link application, along with the new middleware-based architecture.

## 🚨 **Critical Issues Fixed**

### 1. **Lawyer Profile Uniqueness Constraint**
- **Problem**: Users could have multiple lawyer profiles
- **Fix**: Added `UNIQUE(user_id)` constraint on `lawyer_profiles` table
- **Impact**: Prevents data inconsistency and ensures one profile per lawyer

### 2. **Case Status Constraint Mismatch**
- **Problem**: Constraint checked for `'Open'` but status values were `'open'`
- **Fix**: Updated constraint to use lowercase `'open'`
- **Impact**: Business rule now properly enforced

### 3. **Missing Case Application Status Validation**
- **Problem**: No validation for case application status values
- **Fix**: Added check constraint for valid statuses: `'pending'`, `'accepted'`, `'rejected'`
- **Impact**: Prevents invalid status values

### 4. **Missing Unique Constraint on Case Applications**
- **Problem**: Lawyers could apply multiple times to the same case
- **Fix**: Added `UNIQUE(case_id, lawyer_id)` constraint
- **Impact**: Prevents duplicate applications

### 5. **Incomplete Foreign Key Constraints**
- **Problem**: Missing `ON DELETE CASCADE` behavior
- **Fix**: Added proper CASCADE behavior for referential integrity
- **Impact**: Ensures data consistency when parent records are deleted

## 🏗️ **New Middleware Architecture**

The application now uses a proper separation of concerns with dedicated middleware layers:

### **1. Input Validation (`middleware/caseValidation.js`)**
- **Joi schemas** for all case operations
- **Input sanitization** and type checking
- **Custom error messages** for better UX
- **Field validation** to prevent SQL injection

### **2. Data Fetching (`middleware/caseData.js`)**
- **Efficient data retrieval** with minimal queries
- **Data caching** in request object for reuse
- **Specialized functions** for different use cases
- **Error handling** for database operations

### **3. Authorization (`middleware/caseAuthorization.js`)**
- **Role-based access control** (client, lawyer, admin)
- **Case ownership validation**
- **Business rule enforcement**
- **Permission checking** for all operations

### **4. Business Logic (`models/caseModel.js`)**
- **Focused on data operations** only
- **Transaction management** for complex operations
- **Data integrity checks**
- **Clean, maintainable code**

## 🔧 **Case Model Improvements**

### **Simplified Architecture**
- **Removed validation logic** from models
- **Focused on data operations** and business logic
- **Cleaner function signatures** without validation parameters
- **Better separation of concerns**

### **Enhanced Security**
- **SQL injection prevention** through middleware validation
- **Authorization checks** before data operations
- **Input sanitization** and validation
- **Business rule enforcement** at multiple levels

### **Improved Performance**
- **Reduced database queries** through data caching
- **Efficient validation** with Joi schemas
- **Optimized authorization** checks
- **Database-level constraints** for business rules

## 📋 **How to Apply Fixes**

### **Step 1: Update Database Schema**
Run the SQL migration script:
```bash
psql -d your_database_name -f models/fix_database_constraints.sql
```

### **Step 2: Update Routes with Middleware**
Replace your existing case routes with the new middleware chain pattern:

```javascript
// Example: Get case details
router.get('/:caseId',
  auth.requireAuth,                    // Authentication
  caseValidation.validateCaseId,       // Validate case ID
  caseData.fetchCaseData,              // Fetch case data
  caseAuthorization.canAccessCase,     // Check access permission
  caseController.getCase               // Controller action
);
```

### **Step 3: Simplify Controllers**
Update controllers to focus only on business logic:

```javascript
// Before: Mixed validation, authorization, and business logic
exports.postCase = async (req, res, next) => {
  // ... lots of validation and authorization code
  const result = await caseModel.postCase(clientId, req.body, userId, userRole);
  res.status(201).json(result);
};

// After: Clean business logic only
exports.postCase = async (req, res, next) => {
  const { userId } = req.user;
  const result = await caseModel.postCase(userId, req.body);
  res.status(201).json(result);
};
```

### **Step 4: Test the New System**
Verify that:
- All middleware functions work correctly
- Authorization is properly enforced
- Input validation prevents invalid data
- Business rules are followed

## 🚀 **New Features Added**

### **Comprehensive Validation System**
- **Joi schemas** for all input types
- **Custom error messages** for better user experience
- **Data sanitization** and type checking
- **Field validation** to prevent security issues

### **Advanced Authorization System**
- **Role-based permissions** for all operations
- **Case ownership validation**
- **Business rule enforcement**
- **Centralized permission management**

### **Performance Optimizations**
- **Data caching** in middleware
- **Efficient database queries**
- **Reduced validation overhead**
- **Optimized authorization checks**

## 📊 **Database Constraints Added**

### **New Constraints**
```sql
-- Lawyer profile uniqueness
ALTER TABLE lawyer_profiles ADD CONSTRAINT lawyer_profiles_user_id_key UNIQUE (user_id);

-- Case application status validation
ALTER TABLE case_applications ADD CONSTRAINT case_applications_status_check 
CHECK (status IN ('pending', 'accepted', 'rejected'));

-- Case application uniqueness
ALTER TABLE case_applications ADD CONSTRAINT case_applications_case_lawyer_unique 
UNIQUE (case_id, lawyer_id);
```

### **New Triggers**
- `validate_case_status_transition()`: Enforces valid status transitions
- `validate_case_application()`: Ensures only open cases can receive applications
- `validate_lawyer_profile()`: Ensures only lawyer users can have profiles

### **New Indexes**
- Performance improvements for common queries
- Better query execution plans
- Faster data retrieval

## 🔍 **Validation Rules**

### **Case Creation**
- Title: Minimum 3 characters, maximum 255 characters
- Description: Minimum 10 characters, maximum 2000 characters
- Case type: Must be from predefined list
- Priority: Must be valid priority level
- Deadline: Must be in the future (if provided)

### **Case Updates**
- Status transitions must follow business rules
- Only authorized users can update cases
- Field names are validated to prevent SQL injection
- Data is sanitized before processing

### **Case Deletion**
- Only case owner or admin can delete
- Cannot delete cases in progress or with lawyer
- Cannot delete cases with applications or documents
- Business rules enforced at multiple levels

### **Reviews**
- Only case client can review
- Case must have assigned lawyer
- Case must be in progress or pending review
- One review per case per client

## ⚠️ **Breaking Changes**

### **Function Signatures Changed**
- Case model functions no longer require `userId` and `userRole` parameters
- Controllers are simplified and focused on business logic
- Middleware handles all validation and authorization

### **Route Structure Changed**
- All case routes now use middleware chains
- Validation and authorization happen before controller execution
- Data fetching is optimized and cached

### **Error Handling**
- Consistent error messages through middleware
- Proper HTTP status codes for different error types
- Centralized error handling system

## 🧪 **Testing Recommendations**

### **Unit Tests**
- Test all middleware functions individually
- Test validation schemas with various inputs
- Test authorization logic with different user roles
- Test error handling and edge cases

### **Integration Tests**
- Test complete middleware chains
- Test end-to-end case operations
- Test user role restrictions
- Test business rule enforcement

### **Security Tests**
- Test SQL injection prevention
- Test authorization bypass attempts
- Test role escalation attempts
- Test data access controls

## 📚 **Additional Resources**

### **Middleware Files**
- `middleware/caseValidation.js`: Input validation schemas
- `middleware/caseData.js`: Data fetching functions
- `middleware/caseAuthorization.js`: Permission checking
- `middleware/README.md`: Detailed usage guide

### **Model Files**
- `models/caseModel.js`: Simplified business logic
- `models/lawyerModel.js`: Lawyer profile management
- `models/userModel.js`: User management

### **Database Files**
- `models/database schema.sql`: Updated schema with fixes
- `models/fix_database_constraints.sql`: Migration script

## 🎯 **Next Steps**

1. **Apply Database Migration**: Run the SQL script
2. **Update Routes**: Implement middleware chains
3. **Simplify Controllers**: Remove validation and authorization code
4. **Test Middleware**: Verify all functions work correctly
5. **Update Documentation**: Update API documentation
6. **Monitor Performance**: Check for any performance impacts

## 📞 **Support**

If you encounter any issues while applying these fixes:
1. Check the middleware README for usage examples
2. Verify database connection and permissions
3. Ensure all required dependencies are installed
4. Test with a small dataset first

---

**Note**: This new architecture provides a clean, secure, and maintainable way to handle case operations while keeping your code organized and following best practices. The middleware system makes it easy to add new validation rules, authorization checks, and business logic without cluttering your controllers or models.

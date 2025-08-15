-- Database Migration Script to Fix Critical Issues
-- Run this script to fix the identified database problems

-- 1. Fix the case status constraint (already done in schema file)
-- The constraint was checking for 'Open' but should check for 'open'

-- 2. Add unique constraint on lawyer profile user_id
-- This prevents multiple lawyer profiles per user
ALTER TABLE lawyer_profiles 
ADD CONSTRAINT lawyer_profiles_user_id_key UNIQUE (user_id);

-- 3. Add status check constraint for case applications
-- This validates the status field values
ALTER TABLE case_applications 
ADD CONSTRAINT case_applications_status_check 
CHECK (status IN ('pending', 'accepted', 'rejected'));

-- 4. Add unique constraint on case applications
-- This prevents multiple applications from the same lawyer to the same case
ALTER TABLE case_applications 
ADD CONSTRAINT case_applications_case_lawyer_unique 
UNIQUE (case_id, lawyer_id);

-- 5. Add proper foreign key constraints with CASCADE behavior
-- This ensures referential integrity and proper cleanup

-- Drop existing constraints first
ALTER TABLE case_applications DROP CONSTRAINT IF EXISTS case_applications_case_id_fkey;
ALTER TABLE case_applications DROP CONSTRAINT IF EXISTS case_applications_lawyer_id_fkey;

-- Add new constraints with proper CASCADE behavior
ALTER TABLE case_applications 
ADD CONSTRAINT case_applications_case_id_fkey 
FOREIGN KEY (case_id) REFERENCES cases(case_id) ON DELETE CASCADE;

ALTER TABLE case_applications 
ADD CONSTRAINT case_applications_lawyer_id_fkey 
FOREIGN KEY (lawyer_id) REFERENCES users(user_id) ON DELETE CASCADE;

-- 6. Add missing indexes for better performance
CREATE INDEX IF NOT EXISTS idx_case_applications_status ON case_applications(status);
CREATE INDEX IF NOT EXISTS idx_case_applications_lawyer_id ON case_applications(lawyer_id);
CREATE INDEX IF NOT EXISTS idx_case_applications_case_id ON case_applications(case_id);

-- 7. Add missing indexes for lawyer profiles
CREATE INDEX IF NOT EXISTS idx_lawyer_profiles_user_id ON lawyer_profiles(user_id);

-- 8. Add validation trigger for case status transitions
-- This ensures business logic is enforced at the database level

CREATE OR REPLACE FUNCTION validate_case_status_transition()
RETURNS TRIGGER AS $$
BEGIN
    -- Define valid status transitions
    IF OLD.status = 'open' AND NEW.status NOT IN ('in_progress', 'cancelled') THEN
        RAISE EXCEPTION 'Invalid status transition from open to %', NEW.status;
    END IF;
    
    IF OLD.status = 'in_progress' AND NEW.status NOT IN ('pending_review', 'cancelled') THEN
        RAISE EXCEPTION 'Invalid status transition from in_progress to %', NEW.status;
    END IF;
    
    IF OLD.status = 'pending_review' AND NEW.status NOT IN ('closed', 'in_progress') THEN
        RAISE EXCEPTION 'Invalid status transition from pending_review to %', NEW.status;
    END IF;
    
    IF OLD.status = 'closed' AND NEW.status != 'closed' THEN
        RAISE EXCEPTION 'Cannot change status of closed case';
    END IF;
    
    IF OLD.status = 'cancelled' AND NEW.status != 'cancelled' THEN
        RAISE EXCEPTION 'Cannot change status of cancelled case';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
DROP TRIGGER IF EXISTS trigger_validate_case_status ON cases;
CREATE TRIGGER trigger_validate_case_status
    BEFORE UPDATE ON cases
    FOR EACH ROW
    EXECUTE FUNCTION validate_case_status_transition();

-- 9. Add validation trigger for case applications
-- This ensures only open cases can receive applications

CREATE OR REPLACE FUNCTION validate_case_application()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if case is open and not assigned to a lawyer
    IF NOT EXISTS (
        SELECT 1 FROM cases 
        WHERE case_id = NEW.case_id 
        AND status = 'open' 
        AND lawyer_id IS NULL
    ) THEN
        RAISE EXCEPTION 'Cannot apply to case that is not open or already assigned to a lawyer';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
DROP TRIGGER IF EXISTS trigger_validate_case_application ON case_applications;
CREATE TRIGGER trigger_validate_case_application
    BEFORE INSERT ON case_applications
    FOR EACH ROW
    EXECUTE FUNCTION validate_case_application();

-- 10. Add validation trigger for lawyer profiles
-- This ensures only users with lawyer role can have profiles

CREATE OR REPLACE FUNCTION validate_lawyer_profile()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if user has lawyer role
    IF NOT EXISTS (
        SELECT 1 FROM users 
        WHERE user_id = NEW.user_id 
        AND role = 'lawyer'
    ) THEN
        RAISE EXCEPTION 'Only users with lawyer role can have lawyer profiles';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
DROP TRIGGER IF EXISTS trigger_validate_lawyer_profile ON lawyer_profiles;
CREATE TRIGGER trigger_validate_lawyer_profile
    BEFORE INSERT OR UPDATE ON lawyer_profiles
    FOR EACH ROW
    EXECUTE FUNCTION validate_lawyer_profile();

-- 11. Add comments for documentation
COMMENT ON TABLE cases IS 'Legal cases with status tracking and lifecycle management';
COMMENT ON TABLE case_applications IS 'Lawyer applications for cases with status tracking';
COMMENT ON TABLE lawyer_profiles IS 'Professional profiles for lawyers with unique user constraint';
COMMENT ON TABLE reviews IS 'Client reviews for completed cases';

-- 12. Verify all constraints are in place
SELECT 
    table_name,
    constraint_name,
    constraint_type
FROM information_schema.table_constraints 
WHERE table_name IN ('cases', 'case_applications', 'lawyer_profiles')
ORDER BY table_name, constraint_type;

-- Migration completed successfully!
-- All critical database issues have been addressed


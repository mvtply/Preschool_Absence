-- Migration script to update status values from 'approved' to 'reported'
-- This ensures compatibility with the new two-status system

-- Update all 'approved' entries to 'reported'
UPDATE absences 
SET status = 'reported' 
WHERE status = 'approved';

-- Add constraint for valid status values (if not exists)
DO $$ 
BEGIN
    -- Drop existing constraint if it exists
    ALTER TABLE absences DROP CONSTRAINT IF EXISTS absences_status_check;
    
    -- Add new constraint with only two allowed values
    ALTER TABLE absences ADD CONSTRAINT absences_status_check 
        CHECK (status IN ('reported', 'pending verification'));
    
EXCEPTION 
    WHEN OTHERS THEN
        -- If constraint already exists, continue
        NULL;
END $$;

-- Display results
SELECT 
    status,
    COUNT(*) as count
FROM absences 
GROUP BY status
ORDER BY status;
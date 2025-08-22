-- University of Cambridge Primary School Absence Tracking System
-- Simplified Schema - Single Table Design Only

-- Main table for all absence-related data
CREATE TABLE IF NOT EXISTS absences_frontend (
    id SERIAL PRIMARY KEY,
    
    -- Student information
    student_full_name VARCHAR(255) NOT NULL,
    student_parent_1 VARCHAR(255),
    student_parent_2 VARCHAR(255),
    
    -- Class information
    class_name VARCHAR(50) NOT NULL,
    class_teacher_name VARCHAR(100),
    class_capacity INTEGER DEFAULT 30,
    
    -- Absence information
    absence_reason TEXT NOT NULL,
    absence_date DATE NOT NULL,
    absence_status VARCHAR(20) DEFAULT 'reported' CHECK (absence_status IN ('reported', 'pending verification')),
    
    -- Phone system information (optional)
    phone_call_id VARCHAR(100),
    phone_number VARCHAR(50),
    call_duration INTEGER,
    call_transcript TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_absences_frontend_date ON absences_frontend(absence_date);
CREATE INDEX IF NOT EXISTS idx_absences_frontend_class ON absences_frontend(class_name);
CREATE INDEX IF NOT EXISTS idx_absences_frontend_student ON absences_frontend(student_full_name);
CREATE INDEX IF NOT EXISTS idx_absences_frontend_phone_call ON absences_frontend(phone_call_id);

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS absences_frontend_updated_at ON absences_frontend;

-- Update trigger for updated_at timestamp
CREATE OR REPLACE FUNCTION update_absences_frontend_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER absences_frontend_updated_at
    BEFORE UPDATE ON absences_frontend
    FOR EACH ROW
    EXECUTE FUNCTION update_absences_frontend_timestamp();
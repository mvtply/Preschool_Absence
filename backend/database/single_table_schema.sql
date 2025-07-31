-- University of Cambridge Primary School Absence Tracking System
-- Single Table Design with Triggers for Normalized Table Population

-- Drop existing triggers and functions if they exist
DROP TRIGGER IF EXISTS absence_entry_trigger ON absence_entries;
DROP FUNCTION IF EXISTS populate_normalized_tables();

-- Main single table for all absence-related data
CREATE TABLE IF NOT EXISTS absence_entries (
    id SERIAL PRIMARY KEY,
    
    -- Student information
    student_full_name VARCHAR(255) NOT NULL,
    
    -- Class information
    class_name VARCHAR(255) NOT NULL,
    class_teacher_name VARCHAR(255),
    class_capacity INTEGER DEFAULT 30,
    
    -- Absence information
    absence_reason VARCHAR(500) NOT NULL,
    absence_date DATE NOT NULL,
    absence_status VARCHAR(50) DEFAULT 'reported' CHECK (absence_status IN ('reported', 'pending verification')),
    absence_notes TEXT,
    
    -- Phone system information (optional)
    phone_call_id VARCHAR(255),
    phone_number VARCHAR(50),
    call_duration INTEGER,
    call_transcript TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_absence_entries_date ON absence_entries(absence_date);
CREATE INDEX IF NOT EXISTS idx_absence_entries_class ON absence_entries(class_name);
CREATE INDEX IF NOT EXISTS idx_absence_entries_student ON absence_entries(student_full_name);
CREATE INDEX IF NOT EXISTS idx_absence_entries_phone_call ON absence_entries(phone_call_id);

-- Function to populate normalized tables from the single table
CREATE OR REPLACE FUNCTION populate_normalized_tables()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert or update class information
    INSERT INTO classes (name, teacher_name, capacity, created_at)
    VALUES (NEW.class_name, NEW.class_teacher_name, NEW.class_capacity, NEW.created_at)
    ON CONFLICT (name) DO UPDATE SET
        teacher_name = COALESCE(EXCLUDED.teacher_name, classes.teacher_name),
        capacity = COALESCE(EXCLUDED.capacity, classes.capacity);
    
    -- Insert student information (using class_name for now since students table expects it)
    INSERT INTO students (full_name, class_name, created_at, updated_at)
    VALUES (NEW.student_full_name, NEW.class_name, NEW.created_at, NEW.updated_at)
    ON CONFLICT (full_name, class_name) DO NOTHING;
    
    -- Insert absence record
    INSERT INTO absences (
        student_name, 
        class_name, 
        reason, 
        absence_date, 
        phone_system_call_id, 
        status, 
        notes, 
        reported_at,
        created_at
    )
    VALUES (
        NEW.student_full_name,
        NEW.class_name,
        NEW.absence_reason,
        NEW.absence_date,
        NEW.phone_call_id,
        NEW.absence_status,
        NEW.absence_notes,
        NEW.created_at,
        NEW.created_at
    );
    
    -- Insert phone log if phone information is provided
    IF NEW.phone_call_id IS NOT NULL THEN
        INSERT INTO phone_logs (
            call_id,
            phone_number,
            call_duration,
            transcript,
            processed_at,
            status
        )
        VALUES (
            NEW.phone_call_id,
            NEW.phone_number,
            NEW.call_duration,
            NEW.call_transcript,
            NEW.created_at,
            'processed'
        )
        ON CONFLICT (call_id) DO NOTHING;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically populate normalized tables
CREATE TRIGGER absence_entry_trigger
    AFTER INSERT ON absence_entries
    FOR EACH ROW
    EXECUTE FUNCTION populate_normalized_tables();

-- Add unique constraint to prevent duplicate student entries
CREATE UNIQUE INDEX IF NOT EXISTS idx_students_unique 
ON students (full_name, class_name);

-- Update trigger for updated_at timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER absence_entries_updated_at
    BEFORE UPDATE ON absence_entries
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();
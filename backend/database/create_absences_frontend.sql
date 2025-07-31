-- University of Cambridge Primary School Absence Tracking System
-- Single Table Design: absences_frontend with Triggers for Normalized Table Population

-- Drop existing triggers and functions if they exist
DROP TRIGGER IF EXISTS absences_frontend_trigger ON absences_frontend;
DROP FUNCTION IF EXISTS populate_from_absences_frontend();

-- Main single table for all absence-related data
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

-- Function to populate normalized tables from the single table
CREATE OR REPLACE FUNCTION populate_from_absences_frontend()
RETURNS TRIGGER AS $$
DECLARE
    v_class_id INTEGER;
    v_student_id INTEGER;
BEGIN
    -- Insert or get class information
    INSERT INTO classes (name, teacher_name, capacity, created_at)
    VALUES (NEW.class_name, NEW.class_teacher_name, NEW.class_capacity, NEW.created_at)
    ON CONFLICT (name) DO UPDATE SET
        teacher_name = COALESCE(EXCLUDED.teacher_name, classes.teacher_name),
        capacity = COALESCE(EXCLUDED.capacity, classes.capacity)
    RETURNING id INTO v_class_id;
    
    -- If no class was inserted (conflict), get the existing class ID
    IF v_class_id IS NULL THEN
        SELECT id INTO v_class_id FROM classes WHERE name = NEW.class_name;
    END IF;
    
    -- Insert or get student information
    INSERT INTO students (full_name, parent_1, parent_2, class_id)
    VALUES (NEW.student_full_name, NEW.student_parent_1, NEW.student_parent_2, v_class_id)
    ON CONFLICT (full_name) DO UPDATE SET
        parent_1 = COALESCE(EXCLUDED.parent_1, students.parent_1),
        parent_2 = COALESCE(EXCLUDED.parent_2, students.parent_2),
        class_id = EXCLUDED.class_id
    RETURNING id INTO v_student_id;
    
    -- If no student was inserted (conflict), get the existing student ID
    IF v_student_id IS NULL THEN
        SELECT id INTO v_student_id FROM students WHERE full_name = NEW.student_full_name;
    END IF;
    
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
    
    -- Insert absence record
    INSERT INTO absence_records (
        student_id,
        reason,
        absence_date,
        reported_at,
        phone_system_call_id,
        status,
        created_at
    )
    VALUES (
        v_student_id,
        NEW.absence_reason,
        NEW.absence_date,
        NEW.created_at,
        NEW.phone_call_id,
        NEW.absence_status,
        NEW.created_at
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically populate normalized tables
CREATE TRIGGER absences_frontend_trigger
    AFTER INSERT ON absences_frontend
    FOR EACH ROW
    EXECUTE FUNCTION populate_from_absences_frontend();

-- Add unique constraint to prevent duplicate student entries (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'students_full_name_key') THEN
        ALTER TABLE students ADD CONSTRAINT students_full_name_key UNIQUE (full_name);
    END IF;
END
$$;

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
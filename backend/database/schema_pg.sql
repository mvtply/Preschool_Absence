-- University of Cambridge Primary School Absence Tracking System
-- PostgreSQL Database Schema

-- Students table
CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    class_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Classes table
CREATE TABLE IF NOT EXISTS classes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    teacher_name VARCHAR(255),
    capacity INTEGER DEFAULT 30,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Absences table
CREATE TABLE IF NOT EXISTS absences (
    id SERIAL PRIMARY KEY,
    student_name VARCHAR(255) NOT NULL,
    class_name VARCHAR(255) NOT NULL,
    reason VARCHAR(500) NOT NULL,
    absence_date DATE NOT NULL,
    reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    phone_system_call_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'reported',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Phone system logs table
CREATE TABLE IF NOT EXISTS phone_logs (
    id SERIAL PRIMARY KEY,
    call_id VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(50),
    call_duration INTEGER,
    transcript TEXT,
    processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'processed'
);

-- Insert default classes
INSERT INTO classes (name, teacher_name) VALUES 
('Reception A', 'Mrs. Johnson'),
('Reception B', 'Mr. Smith'),
('Year 1 Green', 'Ms. Williams'),
('Year 1 Blue', 'Mrs. Brown'),
('Year 2 Red', 'Mr. Davis'),
('Year 2 Yellow', 'Ms. Wilson')
ON CONFLICT (name) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_absences_date ON absences(absence_date);
CREATE INDEX IF NOT EXISTS idx_absences_class ON absences(class_name);
CREATE INDEX IF NOT EXISTS idx_absences_student ON absences(student_name);
CREATE INDEX IF NOT EXISTS idx_students_class ON students(class_name);
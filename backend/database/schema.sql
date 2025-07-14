-- University of Cambridge Primary School Absence Tracking System
-- Database Schema

-- Students table
CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    class_name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Classes table
CREATE TABLE IF NOT EXISTS classes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    teacher_name TEXT,
    capacity INTEGER DEFAULT 30,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Absences table
CREATE TABLE IF NOT EXISTS absences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_name TEXT NOT NULL,
    class_name TEXT NOT NULL,
    reason TEXT NOT NULL,
    absence_date DATE NOT NULL,
    reported_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    phone_system_call_id TEXT,
    status TEXT DEFAULT 'reported' CHECK (status IN ('reported', 'approved', 'pending verification')),
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Phone system logs table
CREATE TABLE IF NOT EXISTS phone_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    call_id TEXT UNIQUE NOT NULL,
    phone_number TEXT,
    call_duration INTEGER,
    transcript TEXT,
    processed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'processed' CHECK (status IN ('processed', 'failed', 'pending'))
);

-- Insert default classes
INSERT OR IGNORE INTO classes (name, teacher_name) VALUES 
('Reception A', 'Mrs. Johnson'),
('Reception B', 'Mr. Smith'),
('Year 1 Green', 'Ms. Williams'),
('Year 1 Blue', 'Mrs. Brown'),
('Year 2 Red', 'Mr. Davis'),
('Year 2 Yellow', 'Ms. Wilson');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_absences_date ON absences(absence_date);
CREATE INDEX IF NOT EXISTS idx_absences_class ON absences(class_name);
CREATE INDEX IF NOT EXISTS idx_absences_student ON absences(student_name);
CREATE INDEX IF NOT EXISTS idx_students_class ON students(class_name);
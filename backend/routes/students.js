const express = require('express');
const router = express.Router();

// POST /api/students/validate - Validate student exists in specified class
router.post('/validate', async (req, res) => {
    try {
        const { studentName, className } = req.body;
        
        if (!studentName || !className) {
            return res.status(400).json({ 
                error: 'Student name and class name are required' 
            });
        }
        
        const student = await req.db.validateStudent(studentName.trim(), className);
        
        if (!student) {
            return res.status(404).json({ 
                error: `Student "${studentName}" not found in class "${className}". Please check the spelling and ensure the student is enrolled in this class.` 
            });
        }
        
        res.json({ 
            valid: true, 
            student: student,
            message: 'Student found successfully' 
        });
    } catch (error) {
        console.error('Error validating student:', error);
        res.status(500).json({ error: 'Failed to validate student' });
    }
});

// GET /api/students - Get all students
router.get('/', async (req, res) => {
    try {
        const students = await req.db.getAllStudents();
        res.json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ error: 'Failed to fetch students' });
    }
});

// GET /api/students/class/:className - Get students by class
router.get('/class/:className', async (req, res) => {
    try {
        const { className } = req.params;
        const students = await req.db.getStudentsByClass(className);
        res.json(students);
    } catch (error) {
        console.error('Error fetching students by class:', error);
        res.status(500).json({ error: 'Failed to fetch students' });
    }
});

module.exports = router;
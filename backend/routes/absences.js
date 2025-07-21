const express = require('express');
const router = express.Router();

// GET /api/absences/today - Get today's absences
router.get('/today', async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const absences = await req.db.getAbsencesForDate(today);
        res.json(absences);
    } catch (error) {
        console.error('Error fetching today\'s absences:', error);
        res.status(500).json({ error: 'Failed to fetch absences' });
    }
});

// GET /api/absences/date/:date - Get absences for specific date
router.get('/date/:date', async (req, res) => {
    try {
        const { date } = req.params;
        const absences = await req.db.getAbsencesForDate(date);
        res.json(absences);
    } catch (error) {
        console.error('Error fetching absences for date:', error);
        res.status(500).json({ error: 'Failed to fetch absences' });
    }
});

// GET /api/absences/range - Get absences within date range
router.get('/range', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        
        if (!startDate || !endDate) {
            return res.status(400).json({ error: 'Start date and end date are required' });
        }
        
        const absences = await req.db.getAbsencesInRange(startDate, endDate);
        res.json(absences);
    } catch (error) {
        console.error('Error fetching absences in range:', error);
        res.status(500).json({ error: 'Failed to fetch absences' });
    }
});

// POST /api/absences - Add new absence
router.post('/', async (req, res) => {
    try {
        const { studentName, className, reason, absenceDate, phoneCallId, status, notes } = req.body;
        
        if (!studentName || !className || !reason || !absenceDate) {
            return res.status(400).json({ 
                error: 'Student name, class name, reason, and absence date are required' 
            });
        }
        
        const result = await req.db.addAbsence(
            studentName, 
            className, 
            reason, 
            absenceDate, 
            phoneCallId,
            status || 'reported',
            notes || null
        );
        
        res.status(201).json({ 
            message: 'Absence added successfully', 
            id: result.id 
        });
    } catch (error) {
        console.error('Error adding absence:', error);
        res.status(500).json({ error: 'Failed to add absence' });
    }
});

// GET /api/absences/stats - Get absence statistics
router.get('/stats', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        
        if (!startDate || !endDate) {
            return res.status(400).json({ error: 'Start date and end date are required' });
        }
        
        const stats = await req.db.getAbsenceStats(startDate, endDate);
        res.json(stats);
    } catch (error) {
        console.error('Error fetching absence statistics:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});

// PUT /api/absences/:id - Update absence status
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;
        
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({ error: 'Valid absence ID is required' });
        }
        
        if (!status || !['reported', 'pending verification'].includes(status)) {
            return res.status(400).json({ error: 'Valid status is required (reported, pending verification)' });
        }
        
        const result = await req.db.updateAbsence(parseInt(id), status, notes || null);
        
        if (result.changes === 0) {
            return res.status(404).json({ error: 'Absence not found' });
        }
        
        res.json({ message: 'Absence updated successfully' });
    } catch (error) {
        console.error('Error updating absence:', error);
        res.status(500).json({ error: 'Failed to update absence' });
    }
});

// DELETE /api/absences/:id - Delete absence
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({ error: 'Valid absence ID is required' });
        }
        
        const result = await req.db.deleteAbsence(parseInt(id));
        
        if (result.changes === 0) {
            return res.status(404).json({ error: 'Absence not found' });
        }
        
        res.json({ message: 'Absence deleted successfully' });
    } catch (error) {
        console.error('Error deleting absence:', error);
        res.status(500).json({ error: 'Failed to delete absence' });
    }
});

module.exports = router;
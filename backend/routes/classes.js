const express = require('express');
const router = express.Router();

// GET /api/classes - Get all classes
router.get('/', async (req, res) => {
    try {
        const classes = await req.db.getClasses();
        res.json(classes);
    } catch (error) {
        console.error('Error fetching classes:', error);
        res.status(500).json({ error: 'Failed to fetch classes' });
    }
});

module.exports = router;
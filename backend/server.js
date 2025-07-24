const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const Database = require('./database/database');
const absencesRoutes = require('./routes/absences');
const classesRoutes = require('./routes/classes');
const phoneRoutes = require('./routes/phone');
const studentsRoutes = require('./routes/students');

const app = express();
const PORT = process.env.PORT || 5001;

// Initialize database
const db = new Database();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add database instance to request object
app.use((req, res, next) => {
    req.db = db;
    next();
});

// Routes
app.use('/api/absences', absencesRoutes);
app.use('/api/classes', classesRoutes);
app.use('/api/phone', phoneRoutes);
app.use('/api/students', studentsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'University of Cambridge Primary School Absence System API',
        timestamp: new Date().toISOString()
    });
});

// Serve static files from React app in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/build')));
    
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
    });
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🏫 University of Cambridge Primary School Absence System`);
    console.log(`📡 Server running on port ${PORT}`);
    console.log(`🌐 API available at: http://localhost:${PORT}/api`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`📋 Frontend: http://localhost:3000 (development)`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\nShutting down gracefully...');
    await db.close();
    process.exit(0);
});

module.exports = app;
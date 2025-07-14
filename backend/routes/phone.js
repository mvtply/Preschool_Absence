const express = require('express');
const router = express.Router();

// POST /api/phone/report - Simulate phone system reporting absence
router.post('/report', async (req, res) => {
    try {
        const { 
            callId, 
            phoneNumber, 
            callDuration, 
            transcript, 
            studentName, 
            className, 
            reason 
        } = req.body;
        
        if (!callId || !studentName || !className || !reason) {
            return res.status(400).json({ 
                error: 'Call ID, student name, class name, and reason are required' 
            });
        }
        
        // Add phone log
        await req.db.addPhoneLog(callId, phoneNumber, callDuration, transcript);
        
        // Add absence record
        const today = new Date().toISOString().split('T')[0];
        const result = await req.db.addAbsence(
            studentName, 
            className, 
            reason, 
            today, 
            callId
        );
        
        res.status(201).json({ 
            message: 'Absence reported successfully from phone system', 
            absenceId: result.id 
        });
    } catch (error) {
        console.error('Error processing phone report:', error);
        res.status(500).json({ error: 'Failed to process phone report' });
    }
});

// POST /api/phone/simulate - Simulate multiple phone calls for testing
router.post('/simulate', async (req, res) => {
    try {
        const sampleReports = [
            {
                callId: 'CALL_001',
                phoneNumber: '+44123456789',
                callDuration: 45,
                transcript: 'Hello, this is Sarah Johnson calling about my daughter Emma Johnson in Reception A. She has a fever and won\'t be in today.',
                studentName: 'Emma Johnson',
                className: 'Reception A',
                reason: 'Fever'
            },
            {
                callId: 'CALL_002',
                phoneNumber: '+44987654321',
                callDuration: 38,
                transcript: 'Hi, this is Michael Smith. My son James Smith in Year 1 Blue has a dental appointment and will be absent today.',
                studentName: 'James Smith',
                className: 'Year 1 Blue',
                reason: 'Dental appointment'
            },
            {
                callId: 'CALL_003',
                phoneNumber: '+44555123456',
                callDuration: 52,
                transcript: 'Good morning, this is Lisa Williams calling about Olivia Williams in Year 2 Red. She has a stomach bug and needs to stay home.',
                studentName: 'Olivia Williams',
                className: 'Year 2 Red',
                reason: 'Stomach bug'
            }
        ];
        
        const results = [];
        const today = new Date().toISOString().split('T')[0];
        
        for (const report of sampleReports) {
            // Add phone log
            await req.db.addPhoneLog(
                report.callId, 
                report.phoneNumber, 
                report.callDuration, 
                report.transcript
            );
            
            // Add absence record
            const result = await req.db.addAbsence(
                report.studentName, 
                report.className, 
                report.reason, 
                today, 
                report.callId
            );
            
            results.push({ callId: report.callId, absenceId: result.id });
        }
        
        res.status(201).json({ 
            message: 'Sample phone reports processed successfully', 
            results 
        });
    } catch (error) {
        console.error('Error processing simulated phone reports:', error);
        res.status(500).json({ error: 'Failed to process simulated reports' });
    }
});

module.exports = router;
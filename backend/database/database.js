const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

class Database {
    constructor() {
        this.db = null;
        this.init();
    }

    init() {
        const dbPath = path.join(__dirname, 'absence_system.db');
        
        this.db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error('Error opening database:', err.message);
                return;
            }
            console.log('Connected to SQLite database');
        });

        // Read and execute schema
        const schemaPath = path.join(__dirname, 'schema.sql');
        if (fs.existsSync(schemaPath)) {
            const schema = fs.readFileSync(schemaPath, 'utf8');
            this.db.exec(schema, (err) => {
                if (err) {
                    console.error('Error executing schema:', err.message);
                } else {
                    console.log('Database schema initialized successfully');
                }
            });
        }
    }

    // Get all absences for a specific date
    getAbsencesForDate(date) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT * FROM absences 
                WHERE DATE(absence_date) = DATE(?) 
                ORDER BY class_name, student_name
            `;
            
            this.db.all(query, [date], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    // Get absences within a date range
    getAbsencesInRange(startDate, endDate) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT * FROM absences 
                WHERE DATE(absence_date) BETWEEN DATE(?) AND DATE(?)
                ORDER BY absence_date DESC, class_name, student_name
            `;
            
            this.db.all(query, [startDate, endDate], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    // Add new absence record
    addAbsence(studentName, className, reason, absenceDate, phoneCallId = null, status = 'reported', notes = null) {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO absences (student_name, class_name, reason, absence_date, phone_system_call_id, status, notes)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            
            this.db.run(query, [studentName, className, reason, absenceDate, phoneCallId, status, notes], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID, changes: this.changes });
                }
            });
        });
    }

    // Get absence statistics
    getAbsenceStats(startDate, endDate) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT 
                    class_name,
                    COUNT(*) as absence_count,
                    COUNT(DISTINCT student_name) as unique_students,
                    GROUP_CONCAT(DISTINCT reason) as reasons
                FROM absences 
                WHERE DATE(absence_date) BETWEEN DATE(?) AND DATE(?)
                GROUP BY class_name
                ORDER BY absence_count DESC
            `;
            
            this.db.all(query, [startDate, endDate], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    // Update absence record
    updateAbsence(id, status, notes = null) {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE absences SET status = ?, notes = ? WHERE id = ?';
            
            this.db.run(query, [status, notes, id], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ changes: this.changes });
                }
            });
        });
    }

    // Delete absence record
    deleteAbsence(id) {
        return new Promise((resolve, reject) => {
            const query = 'DELETE FROM absences WHERE id = ?';
            
            this.db.run(query, [id], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ changes: this.changes });
                }
            });
        });
    }

    // Get all classes
    getClasses() {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM classes ORDER BY name';
            
            this.db.all(query, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    // Add phone log
    addPhoneLog(callId, phoneNumber, callDuration, transcript) {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO phone_logs (call_id, phone_number, call_duration, transcript)
                VALUES (?, ?, ?, ?)
            `;
            
            this.db.run(query, [callId, phoneNumber, callDuration, transcript], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID, changes: this.changes });
                }
            });
        });
    }

    close() {
        return new Promise((resolve, reject) => {
            this.db.close((err) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('Database connection closed');
                    resolve();
                }
            });
        });
    }
}

module.exports = Database;
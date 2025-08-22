const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');

class Database {
    constructor() {
        this.pool = null;
        this.init();
    }

    init() {
        // PostgreSQL connection configuration
        this.pool = new Pool({
            user: process.env.DB_USER || 'postgres',
            host: process.env.DB_HOST || 'preschool.ctyo0iu00o7n.eu-north-1.rds.amazonaws.com',
            database: process.env.DB_NAME || 'preschool',
            password: process.env.DB_PASSWORD || 'onesound123',
            port: parseInt(process.env.DB_PORT) || 5432,
            ssl: {
                rejectUnauthorized: false
            }
        });

        // Test connection
        this.pool.connect((err, client, release) => {
            if (err) {
                console.error('Error connecting to PostgreSQL database:', err.message);
                return;
            }
            console.log('Connected to PostgreSQL database');
            release();
        });

        // Read and execute schema
        this.initializeSchema();
    }

    async initializeSchema() {
        const schemaPath = path.join(__dirname, 'schema_clean.sql');
        if (fs.existsSync(schemaPath)) {
            try {
                const schema = fs.readFileSync(schemaPath, 'utf8');
                // Execute the entire schema as one statement to handle functions properly
                await this.pool.query(schema);
                console.log('Database schema initialized successfully');
            } catch (err) {
                console.error('Error executing schema:', err.message);
            }
        }
    }

    // Get all absences for a specific date
    async getAbsencesForDate(date) {
        try {
            const query = `
                SELECT 
                    id,
                    student_full_name as student_name,
                    class_name,
                    absence_reason as reason,
                    absence_date,
                    created_at as reported_at,
                    phone_call_id as phone_system_call_id,
                    absence_status as status,
                    NULL as notes
                FROM absences_frontend 
                WHERE DATE(absence_date) = DATE($1) 
                ORDER BY class_name, student_full_name
            `;
            
            const result = await this.pool.query(query, [date]);
            return result.rows;
        } catch (err) {
            throw err;
        }
    }

    // Get absences within a date range
    async getAbsencesInRange(startDate, endDate) {
        try {
            const query = `
                SELECT 
                    id,
                    student_full_name as student_name,
                    class_name,
                    absence_reason as reason,
                    absence_date,
                    created_at as reported_at,
                    phone_call_id as phone_system_call_id,
                    absence_status as status,
                    NULL as notes
                FROM absences_frontend 
                WHERE DATE(absence_date) BETWEEN DATE($1) AND DATE($2)
                ORDER BY absence_date DESC, class_name, student_full_name
            `;
            
            const result = await this.pool.query(query, [startDate, endDate]);
            return result.rows;
        } catch (err) {
            throw err;
        }
    }

    // Add new absence record
    async addAbsence(studentName, className, reason, absenceDate, phoneCallId = null, status = 'reported', notes = null, phoneNumber = null, callDuration = null, transcript = null) {
        try {
            const query = `
                INSERT INTO absences_frontend (
                    student_full_name, 
                    class_name, 
                    absence_reason, 
                    absence_date, 
                    phone_call_id, 
                    absence_status,
                    phone_number,
                    call_duration,
                    call_transcript
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                RETURNING id
            `;
            
            const result = await this.pool.query(query, [
                studentName, 
                className, 
                reason, 
                absenceDate, 
                phoneCallId, 
                status,
                phoneNumber,
                callDuration,
                transcript
            ]);
            return { id: result.rows[0].id, changes: 1 };
        } catch (err) {
            throw err;
        }
    }

    // Get absence statistics
    async getAbsenceStats(startDate, endDate) {
        try {
            const query = `
                SELECT 
                    class_name,
                    COUNT(*)::int as absence_count,
                    COUNT(DISTINCT student_full_name)::int as unique_students,
                    STRING_AGG(DISTINCT absence_reason, ', ') as reasons
                FROM absences_frontend 
                WHERE DATE(absence_date) BETWEEN DATE($1) AND DATE($2)
                GROUP BY class_name
                ORDER BY absence_count DESC
            `;
            
            const result = await this.pool.query(query, [startDate, endDate]);
            return result.rows;
        } catch (err) {
            throw err;
        }
    }

    // Update absence record
    async updateAbsence(id, status, notes = null) {
        try {
            const query = 'UPDATE absences_frontend SET absence_status = $1 WHERE id = $2';
            
            const result = await this.pool.query(query, [status, id]);
            return { changes: result.rowCount };
        } catch (err) {
            throw err;
        }
    }

    // Delete absence record
    async deleteAbsence(id) {
        try {
            const query = 'DELETE FROM absences_frontend WHERE id = $1';
            
            const result = await this.pool.query(query, [id]);
            return { changes: result.rowCount };
        } catch (err) {
            throw err;
        }
    }

    // Get all classes from absences_frontend
    async getClasses() {
        try {
            const query = `
                SELECT DISTINCT 
                    class_name as name,
                    class_teacher_name as teacher_name,
                    class_capacity as capacity
                FROM absences_frontend 
                ORDER BY class_name
            `;
            
            const result = await this.pool.query(query);
            return result.rows;
        } catch (err) {
            throw err;
        }
    }

    // Validate student exists in specified class (from absences_frontend data)
    async validateStudent(studentName, className) {
        try {
            const query = `
                SELECT DISTINCT 
                    student_full_name as full_name,
                    class_name,
                    class_teacher_name as teacher_name
                FROM absences_frontend 
                WHERE student_full_name = $1 AND class_name = $2
                LIMIT 1
            `;
            
            const result = await this.pool.query(query, [studentName, className]);
            return result.rows.length > 0 ? result.rows[0] : null;
        } catch (err) {
            throw err;
        }
    }

    // Get all students from absences_frontend
    async getAllStudents() {
        try {
            const query = `
                SELECT DISTINCT 
                    student_full_name as full_name,
                    class_name,
                    class_teacher_name as teacher_name
                FROM absences_frontend 
                ORDER BY class_name, student_full_name
            `;
            
            const result = await this.pool.query(query);
            return result.rows;
        } catch (err) {
            throw err;
        }
    }

    // Get students by class name from absences_frontend
    async getStudentsByClass(className) {
        try {
            const query = `
                SELECT DISTINCT 
                    student_full_name as full_name,
                    class_name,
                    class_teacher_name as teacher_name
                FROM absences_frontend 
                WHERE class_name = $1
                ORDER BY student_full_name
            `;
            
            const result = await this.pool.query(query, [className]);
            return result.rows;
        } catch (err) {
            throw err;
        }
    }

    async close() {
        try {
            await this.pool.end();
            console.log('Database connection closed');
        } catch (err) {
            throw err;
        }
    }
}

module.exports = Database;
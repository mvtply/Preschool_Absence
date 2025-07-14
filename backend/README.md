# Backend - Absence Tracking API

Node.js Express backend for the University of Cambridge Primary School Absence Tracking System.

## Technology Stack

- **Node.js** with Express.js
- **SQLite** database with SQL schema
- **CORS** enabled for frontend integration
- **RESTful API** design

## Features

- Student absence record management
- Phone system integration simulation
- Class and student management
- Statistics and reporting endpoints
- Real-time data synchronization

## API Endpoints

### Absence Management
- `GET /api/absences/today` - Get today's absences
- `GET /api/absences/range` - Get absences within date range
- `POST /api/absences` - Create new absence record
- `PUT /api/absences/:id` - Update absence status
- `DELETE /api/absences/:id` - Delete absence record
- `GET /api/absences/stats` - Get absence statistics

### Phone System
- `POST /api/phone/report` - Report absence from phone system
- `POST /api/phone/simulate` - Simulate phone calls for testing

### System
- `GET /api/health` - API health check
- `GET /api/classes` - Get all available classes

## Database Schema

### Tables
- **absences**: Main absence records
- **students**: Student information
- **classes**: Class definitions and teachers
- **phone_logs**: Phone system call records

### Status Values
- `reported` - Standard absence report
- `approved` - Verified and approved by staff
- `pending verification` - Requires manual review (poor audio, accent issues)

## Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm start
# Server runs on http://localhost:5001
```

### Environment Variables
```bash
PORT=5001                    # Server port (optional)
NODE_ENV=development         # Environment mode
```

## Database

The system uses SQLite for simplicity and portability:
- Database file: `database/absence_system.db`
- Schema: `database/schema.sql`
- Connection: `database/database.js`

### Sample Data
The system includes realistic sample data for demonstration:
- Multiple absence records
- Various absence reasons
- Phone system integration examples
- Different status types

## Phone System Integration

The backend simulates phone system integration:
- Incoming call processing
- Audio quality detection
- Automatic status assignment
- Manual verification flagging

## Error Handling

- Comprehensive error responses
- Input validation
- Database constraint enforcement
- CORS configuration for frontend

## Security

- Input sanitization
- SQL injection prevention
- CORS policy configuration
- No sensitive data exposure
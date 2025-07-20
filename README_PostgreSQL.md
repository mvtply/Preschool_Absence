# University of Cambridge Primary School Absence System - PostgreSQL Integration

This system has been updated to use PostgreSQL as the backend database instead of SQLite. The frontend React application connects to a Node.js backend that interfaces with a PostgreSQL database hosted on AWS RDS.

## Database Configuration

The system is configured to connect to the following PostgreSQL database:
- **Host**: preschool.ctyo0iu00o7n.eu-north-1.rds.amazonaws.com
- **Port**: 5432
- **Database**: preschool
- **User**: postgres
- **Password**: onesound123

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm (v8 or higher)
- Access to the PostgreSQL database (already configured)

### Installation

1. Install all dependencies:
```bash
npm run install:all
```

### Running the Application

#### Development Mode (Both Backend and Frontend)
```bash
npm run dev
```

#### Backend Only
```bash
npm run start:backend
```
The backend will be available at: http://localhost:5001

#### Frontend Only
```bash
npm run start:frontend
```
The frontend will be available at: http://localhost:3000

### Database Schema

The PostgreSQL database includes the following tables:
- `students` - Student information
- `classes` - Class details with teachers
- `absences` - Absence records with dates, reasons, and status
- `phone_logs` - Phone system integration logs

### API Endpoints

- `GET /api/absences/today` - Get today's absences
- `POST /api/absences` - Add new absence
- `DELETE /api/absences/:id` - Delete absence
- `GET /api/classes` - Get all classes
- `POST /api/phone/simulate` - Simulate phone system calls

### Features

- **Real-time absence tracking** - View today's absences with real-time updates
- **Database-driven data** - All data is stored in PostgreSQL database
- **Phone system simulation** - Simulate receiving phone calls from parents
- **Manual entry** - Add absences manually through the interface
- **Class management** - Predefined classes with teacher assignments
- **Responsive design** - Material-UI components for modern interface

### Environment Variables

Backend environment variables are configured in `backend/.env`:
- `PORT` - Backend server port (default: 5001)
- `DB_HOST` - PostgreSQL host
- `DB_PORT` - PostgreSQL port  
- `DB_NAME` - Database name
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password

### Database Connection

The database connection is automatically established when the backend starts. The schema is initialized automatically if tables don't exist.

### Testing

To test the database connection:
```bash
cd backend
node -e "const Database = require('./database/database'); new Database();"
```

You should see "Connected to PostgreSQL database" and "Database schema initialized successfully".
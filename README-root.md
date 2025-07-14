# University of Cambridge Primary School - Absence Tracking Dashboard

A comprehensive dashboard system for tracking student absences through an automated phone system integration.

## Features

- **Real-time Absence Tracking**: View today's absences with detailed information
- **Phone System Integration**: Automatically processes phone calls from parents
- **Calendar View**: Historical absence tracking with interactive calendar
- **Statistics & Reports**: Generate custom reports and export data
- **Clean UI**: Pastel color theme matching school branding (green, blue, yellow, purple)
- **Responsive Design**: Works on desktop and mobile devices

## System Architecture

- **Frontend**: React with TypeScript and Material-UI
- **Backend**: Node.js with Express
- **Database**: SQLite for local hosting
- **Phone Integration**: Mock API endpoints for phone system simulation

## Setup Instructions

### Prerequisites
- Node.js (v14 or later)
- npm

### Installation

1. **Clone and navigate to the project directory**
   ```bash
   cd prescool_absence
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. **Start the development environment**
   ```bash
   # Start both backend and frontend concurrently
   npm run dev:all
   ```

   Or start them separately:
   ```bash
   # Terminal 1 - Backend (API server)
   npm run server

   # Terminal 2 - Frontend (React app)
   npm run client
   ```

### Quick Start (Recommended)

Use the restart script for easy setup:
```bash
./restart.sh
```

This script will:
- Stop any existing servers
- Check and install dependencies
- Start both backend and frontend
- Perform health checks
- Show real-time logs

### Access the Application

- **Frontend Dashboard**: http://localhost:3000
- **Backend API**: http://localhost:5001
- **API Health Check**: http://localhost:5001/api/health

## API Endpoints

### Absences
- `GET /api/absences/today` - Get today's absences
- `GET /api/absences/date/:date` - Get absences for specific date
- `GET /api/absences/range` - Get absences within date range
- `POST /api/absences` - Add new absence manually
- `DELETE /api/absences/:id` - Delete specific absence record
- `GET /api/absences/stats` - Get absence statistics

### Phone System
- `POST /api/phone/report` - Report absence from phone system
- `POST /api/phone/simulate` - Simulate phone calls (for testing)

### Classes
- `GET /api/classes` - Get all classes

## Database Schema

The system uses SQLite with the following main tables:

- **absences**: Student absence records with phone system integration
- **students**: Student information
- **classes**: Class definitions
- **phone_logs**: Phone system call logs

## Usage

### Daily Workflow

1. **Morning Setup**: Access the dashboard at 8:00 AM
2. **Phone Integration**: Parents call the automated system to report absences
3. **Real-time Updates**: Dashboard shows incoming absence reports
4. **Staff Review**: Teachers can review and approve absence reports
5. **Historical Tracking**: Use calendar view to monitor patterns

### Testing the System

1. **Simulate Phone Calls**: Use the "Simulate Phone Calls" button (top of dashboard) to add sample data
2. **Manual Entry**: Add absences manually using the "Manual Entry" button (top of dashboard)
3. **Delete Entries**: Remove individual absence records using the delete button on each entry
4. **View Reports**: Use the statistics section to generate reports
5. **Calendar Navigation**: Browse historical data using the interactive calendar

## Features in Detail

### Dashboard Components

1. **Quick Actions**: Top-positioned buttons for "Simulate Phone Calls" and "Manual Entry"
2. **School Banner**: Displays school logo and current date/time
3. **Today's Absences**: Real-time view of current day's absences with delete functionality
4. **Calendar View**: Monthly calendar with absence indicators and detailed daily views
5. **Statistics**: Detailed reporting with custom date ranges

### Phone System Integration

The system is designed to integrate with an automated phone system that:
- Captures student name, class, and reason for absence
- Generates unique call IDs for tracking
- Stores call transcripts for reference
- Automatically creates absence records

## Color Scheme

The dashboard uses a pastel color theme representing the school:
- **Primary Blue**: #7FB3D3 (Soft blue)
- **Secondary Green**: #90C695 (Soft green)
- **Accent Purple**: #B39DDB (Soft purple)
- **Accent Yellow**: #FFD54F (Soft yellow)

## Production Deployment

For production deployment:

1. **Build the frontend**
   ```bash
   npm run build
   ```

2. **Set environment variables**
   ```bash
   export NODE_ENV=production
   export PORT=5000
   ```

3. **Start the server**
   ```bash
   npm start
   ```

## Support

For technical support or questions about the system, please contact the IT department or refer to the system documentation.

## License

This software is proprietary to University of Cambridge Primary School.
# University of Cambridge Primary School - Absence Tracking System

A comprehensive full-stack application for tracking student absences through an automated phone system integration.

## 🏗️ Project Structure

```
Preschool_Absence/
├── src/                      # React TypeScript frontend (root level)
│   ├── components/           # React components
│   ├── App.tsx              # Main application
│   └── theme.ts             # Material-UI theme
├── public/                  # Static assets
├── backend/                 # Node.js Express backend
│   ├── routes/             # API route handlers
│   ├── database/           # PostgreSQL database & schema
│   ├── server.js           # Express server
│   └── package.json        # Backend dependencies
├── package.json            # Root package.json with dev scripts
├── dummy_absences_today.json # Sample data
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm
- PostgreSQL database access

### 1. Clone Repository
```bash
git clone https://github.com/RoaringSquid/Preschool_Absence.git
cd Preschool_Absence
```

### 2. Install All Dependencies (Automated)
```bash
# Install both frontend and backend dependencies automatically
npm run install:all
```

**What gets installed automatically:**
- **Frontend**: React, TypeScript, Material-UI, testing libraries, web-vitals
- **Backend**: Node.js, Express, PostgreSQL client, CORS, body-parser
- **Development**: Concurrently for running both services, nodemon for auto-restart

### 3. Configure Database
Set up your PostgreSQL connection in `backend/.env`:
```bash
DB_HOST=your-database-host
DB_PORT=5432
DB_NAME=preschool
DB_USER=postgres
DB_PASSWORD=your-password
```

### 4. Start Both Services (Simplified)
```bash
# Start both frontend and backend simultaneously
npm run dev
```

**Alternative: Start services individually**
```bash
# Backend only (from root directory)
npm run start:backend

# Frontend only (from root directory) 
npm run start:frontend
```

### 5. Stop Both Services
```bash
# Press Ctrl+C to stop both services when using npm run dev
```

### 6. Access Application
- **Frontend Dashboard**: http://localhost:3000
- **Backend API**: http://localhost:5001
- **API Health Check**: http://localhost:5001/api/health

## 🔧 Troubleshooting

### Dependency Installation Issues
If you encounter peer dependency conflicts during installation:
```bash
# Use legacy peer deps flag
npm install --legacy-peer-deps

# Or for the install:all script
npm run install:all --legacy-peer-deps
```

### Common Setup Issues
- **Missing dependencies**: All required libraries are pre-configured in package.json
- **TypeScript errors**: Ensure all @types packages are installed via `npm run install:all`
- **Database connection**: Verify your `.env` file in the backend directory
- **Port conflicts**: Ensure ports 3000 and 5001 are available

## 🎯 Features

### Dashboard Features
- **Real-time Absence Tracking**: View today's absences with color-coded class indicators
- **Monthly Calendar**: Interactive calendar showing absence patterns
- **Statistics & Analytics**: Date range reporting with CSV export
- **Manual Entry System**: Staff can manually add absence records
- **Phone System Integration**: Automated absence reporting via phone calls
- **Pending Verification**: Flags calls requiring manual review (poor audio, accents)

### Technical Features
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Material-UI Components**: Professional, accessible interface
- **TypeScript**: Type-safe frontend development
- **PostgreSQL Database**: Robust, scalable database with AWS RDS support
- **RESTful API**: Clean, documented API endpoints
- **Real-time Updates**: Live data synchronization

## 📱 User Interface

### Today's Absences
- Color-coded by class (Reception A/B, Year 1 Green/Blue, Year 2 Red/Yellow)
- Status indicators: reported, approved, pending verification
- Phone system integration badges
- Quick delete functionality

### Absence Calendar
- Monthly view with absence count badges
- Click dates for detailed absence information
- Easy month navigation

### Statistics Dashboard
- Customizable date range reporting
- Total absences, unique students, and trends
- Class-by-class breakdown
- Export to CSV functionality

## 🔧 API Endpoints

### Absence Management
- `GET /api/absences/today` - Fetch today's absences
- `GET /api/absences/range` - Get absences in date range
- `POST /api/absences` - Add new absence record
- `PUT /api/absences/:id` - Update absence status
- `DELETE /api/absences/:id` - Delete absence record
- `GET /api/absences/stats` - Get absence statistics

### Phone System
- `POST /api/phone/report` - Report absence from phone system
- `POST /api/phone/simulate` - Simulate phone calls (testing)

### System
- `GET /api/health` - API health check
- `GET /api/classes` - Get all classes

## 🗃️ Database Schema

### Tables
- **absences**: Main absence records with phone integration
- **students**: Student information
- **classes**: Class definitions
- **phone_logs**: Phone system call logs

### Status Values
- `reported`: Standard absence report (accepted by school)  
- `pending verification`: Requires manual review (poor audio quality, heavy accent, etc.)

## 🎨 Design System

- **Theme**: University of Cambridge inspired colors
- **Palette**: Pastel colors for visual appeal
- **Typography**: Consistent, accessible font hierarchy
- **Responsive**: Mobile-first design approach
- **Components**: Reusable Material-UI components

## 🧪 Testing & Development

### Frontend Testing
```bash
cd frontend
npm test
```

### Backend Testing
```bash
cd backend
npm test  # (when test suite is added)
```

### Production Build
```bash
cd frontend
npm run build
```

## 📊 Sample Data

The system includes realistic sample data:
- 6 absence records for today
- Various absence reasons (illness, appointments, family matters)
- Different classes represented
- Phone system integration examples
- Pending verification scenarios

## 🔒 Security & Privacy

- No real personal data included
- Demo phone numbers only
- Local development environment
- PostgreSQL database with secure connection
- Environment variables for database credentials

## 🤝 Contributing

This is a demonstration project for University of Cambridge Primary School.

## 📄 License

This software is proprietary to University of Cambridge Primary School.

---

**Built with ❤️ for University of Cambridge Primary School**
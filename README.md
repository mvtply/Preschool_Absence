# University of Cambridge Primary School - Absence Tracking System

A comprehensive full-stack application for tracking student absences through an automated phone system integration.

## 🏗️ Project Structure

```
Preschool_Absence/
├── frontend/                 # React TypeScript frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── App.tsx          # Main application
│   │   └── theme.ts         # Material-UI theme
│   ├── public/              # Static assets
│   ├── package.json         # Frontend dependencies
│   └── README.md           # Frontend documentation
├── backend/                 # Node.js Express backend
│   ├── routes/             # API route handlers
│   ├── database/           # SQLite database & schema
│   ├── server.js           # Express server
│   └── package.json        # Backend dependencies
├── dummy_absences_today.json # Sample data
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm

### 1. Clone Repository
```bash
git clone https://github.com/RoaringSquid/Preschool_Absence.git
cd Preschool_Absence
```

### 2. Install Dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies  
cd ../frontend
npm install
```

### 3. Start Development Servers
```bash
# Start backend (from backend directory)
npm start

# Start frontend (from frontend directory) 
npm start
```

### 4. Access Application
- **Frontend Dashboard**: http://localhost:3000
- **Backend API**: http://localhost:5001
- **API Health Check**: http://localhost:5001/api/health

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
- **SQLite Database**: Lightweight, file-based data storage
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
- `reported`: Standard absence report
- `approved`: Verified and approved
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
- SQLite database for contained data
- No external API keys required

## 🤝 Contributing

This is a demonstration project for University of Cambridge Primary School.

## 📄 License

This software is proprietary to University of Cambridge Primary School.

---

**Built with ❤️ for University of Cambridge Primary School**
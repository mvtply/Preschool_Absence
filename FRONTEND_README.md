# University of Cambridge Primary School - Frontend Dashboard

This is the React frontend for the University of Cambridge Primary School Absence Tracking System.

## Technology Stack

- **React 19** with TypeScript
- **Material-UI (MUI)** for components and styling
- **Day.js** for date manipulation
- **Material-UI X Date Pickers** for calendar functionality

## Features

### Dashboard Components

- **Today's Absences**: Real-time view of daily absence reports
- **Absence Calendar**: Monthly calendar view with absence indicators
- **Absence Statistics**: Analytics and reporting for date ranges
- **School Banner**: Branded header with school information

### Key Functionality

- **Manual Entry**: Staff can manually add absence records
- **Simulate Phone Calls**: Generate sample absence data for testing
- **Delete Absences**: Remove incorrect or duplicate entries
- **Export Data**: Download absence statistics as CSV
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm start
```

Runs the frontend in development mode on [http://localhost:3000](http://localhost:3000).

### Testing

```bash
npm test
```

Launches the test runner in interactive watch mode.

## Project Structure

```
src/
├── components/           # React components
│   ├── AbsenceCalendar.tsx    # Monthly calendar view
│   ├── AbsenceStats.tsx       # Statistics and analytics
│   ├── SchoolBanner.tsx       # School header component
│   └── TodayAbsences.tsx      # Daily absence list
├── App.tsx              # Main application component
├── theme.ts             # Material-UI theme configuration
└── index.tsx            # Application entry point
```

## Component Details

### TodayAbsences
- Displays real-time absence data for the current day
- Color-coded by class (Reception A/B, Year 1 Green/Blue, Year 2 Red/Yellow)
- Status indicators (reported, approved, pending verification)
- Delete functionality with confirmation
- Phone system integration indicators

### AbsenceCalendar
- Monthly calendar view with absence count badges
- Date selection for detailed absence information
- Navigation between months
- Responsive grid layout

### AbsenceStats
- Date range selector for custom reporting periods
- Summary statistics (total absences, unique students, average)
- Class-by-class breakdown with visual indicators
- CSV export functionality

### SchoolBanner
- University of Cambridge Primary School branding
- Responsive typography and layout

## API Integration

The frontend communicates with the backend API at `http://localhost:5001/api`:

- **GET /absences/today** - Fetch today's absences
- **GET /absences/range** - Fetch absences within date range
- **POST /absences** - Add new absence record
- **DELETE /absences/:id** - Delete absence record
- **GET /absences/stats** - Get absence statistics
- Manages phone system simulation

## Styling & Theme

- Custom Material-UI theme with University of Cambridge colors
- Pastel color palette for visual appeal
- Consistent spacing and typography
- Dark mode support through Material-UI theming
- Responsive breakpoints for all screen sizes
- Loading states and skeleton screens for better UX

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder, ready for deployment.
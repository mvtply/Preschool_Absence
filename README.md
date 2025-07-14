# University of Cambridge Primary School - Frontend Dashboard

This is the React frontend for the University of Cambridge Primary School Absence Tracking System.

## Technology Stack

- **React 19** with TypeScript
- **Material-UI (MUI)** for components and styling
- **Day.js** for date manipulation
- **MUI X Date Pickers** for calendar functionality

## Project Structure

```
src/
├── components/
│   ├── SchoolBanner.tsx      # University branding and header
│   ├── TodayAbsences.tsx     # Real-time absence display with delete functionality
│   ├── AbsenceCalendar.tsx   # Interactive calendar view
│   └── AbsenceStats.tsx      # Statistics and reporting
├── App.tsx                   # Main application component
├── theme.ts                  # MUI theme configuration (pastel colors)
└── index.tsx                 # Application entry point
```

## Available Scripts

### `npm start`
Runs the frontend in development mode on [http://localhost:3000](http://localhost:3000).

### `npm run build`
Builds the app for production to the `build` folder.

### `npm test`
Launches the test runner in interactive watch mode.

## Features

### Quick Actions (Top of Dashboard)
- **Simulate Phone Calls**: Generate sample absence data for testing
- **Manual Entry**: Add absence records manually via form

### Today's Absences
- Real-time display of current day's absences
- Color-coded by class (Reception A/B, Year 1 Green/Blue, Year 2 Red/Yellow)
- Delete functionality with confirmation
- Status indicators (reported, approved, questioned)
- Phone system integration indicators

### Calendar View
- Interactive monthly calendar
- Badge indicators showing absence counts per day
- Detailed daily view on date selection
- Responsive layout for all screen sizes

### Statistics Dashboard
- Custom date range reporting
- Class-by-class absence breakdowns
- Visual charts and metrics

## Styling and Theme

The application uses a custom MUI theme with pastel colors:

- **Reception A**: Soft Blue (#7FB3D3)
- **Reception B**: Soft Green (#90C695)
- **Year 1 Green**: Soft Green (#90C695)
- **Year 1 Blue**: Soft Blue (#7FB3D3)
- **Year 2 Red**: Soft Red (#FF8A80)
- **Year 2 Yellow**: Soft Yellow (#FFD54F)

## API Integration

The frontend communicates with the backend API at `http://localhost:5001/api`:

- Fetches absence data in real-time
- Handles manual absence entry
- Manages phone system simulation
- Processes delete operations

## Development Notes

- Built with Create React App for fast development setup
- TypeScript for type safety and better development experience
- Responsive design works on desktop and mobile devices
- Error handling with user-friendly messages
- Loading states and skeleton screens for better UX

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder, ready for deployment.
import React, { useState } from 'react';
import { 
  ThemeProvider, 
  CssBaseline, 
  Container, 
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Alert,
  Snackbar
} from '@mui/material';
import { Add, Phone } from '@mui/icons-material';
import theme from './theme';
import SchoolBanner from './components/SchoolBanner';
import TodayAbsences from './components/TodayAbsences';
import AbsenceCalendar from './components/AbsenceCalendar';
import AbsenceStats from './components/AbsenceStats';

const classes = [
  'Reception A',
  'Reception B', 
  'Year 1 Green',
  'Year 1 Blue',
  'Year 2 Red',
  'Year 2 Yellow'
];

function App() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [simulateDialogOpen, setSimulateDialogOpen] = useState(false);
  const [manualDialogOpen, setManualDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  
  // Manual entry form state
  const [formData, setFormData] = useState({
    studentName: '',
    className: '',
    reason: ''
  });

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleSimulatePhoneCalls = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/phone/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error('Failed to simulate phone calls');
      }
      
      const result = await response.json();
      setSnackbar({ 
        open: true, 
        message: `Successfully simulated ${result.results.length} phone calls`,
        severity: 'success' 
      });
      setSimulateDialogOpen(false);
      handleRefresh();
    } catch (error) {
      setSnackbar({ 
        open: true, 
        message: 'Failed to simulate phone calls', 
        severity: 'error' 
      });
    }
  };

  const handleManualEntry = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/absences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: formData.studentName,
          className: formData.className,
          reason: formData.reason,
          absenceDate: new Date().toISOString().split('T')[0]
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to add absence');
      }
      
      setSnackbar({ 
        open: true, 
        message: 'Absence added successfully',
        severity: 'success' 
      });
      setManualDialogOpen(false);
      setFormData({ studentName: '', className: '', reason: '' });
      handleRefresh();
    } catch (error) {
      setSnackbar({ 
        open: true, 
        message: 'Failed to add absence', 
        severity: 'error' 
      });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <SchoolBanner />
        
        <Container maxWidth="xl" sx={{ py: 3 }}>
          {/* Quick Actions - Moved to top */}
          <Box sx={{ mb: 3, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              startIcon={<Phone />}
              onClick={() => setSimulateDialogOpen(true)}
              sx={{ py: 1.5, minWidth: 200 }}
            >
              Simulate Phone Calls
            </Button>
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={() => setManualDialogOpen(true)}
              sx={{ py: 1.5, minWidth: 200 }}
            >
              Manual Entry
            </Button>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Today's Absences */}
            <TodayAbsences key={refreshKey} onRefresh={handleRefresh} />
            
            {/* Calendar */}
            <AbsenceCalendar />
            
            {/* Statistics */}
            <AbsenceStats />
          </Box>
        </Container>

        {/* Simulate Phone Calls Dialog */}
        <Dialog open={simulateDialogOpen} onClose={() => setSimulateDialogOpen(false)}>
          <DialogTitle>Simulate Phone System</DialogTitle>
          <DialogContent>
            <Alert severity="info" sx={{ mb: 2 }}>
              This will simulate receiving phone calls from parents reporting absences. 
              Sample data will be added to demonstrate the system.
            </Alert>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSimulateDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSimulatePhoneCalls} variant="contained">
              Simulate Calls
            </Button>
          </DialogActions>
        </Dialog>

        {/* Manual Entry Dialog */}
        <Dialog open={manualDialogOpen} onClose={() => setManualDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Manual Absence Entry</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <TextField
                label="Student Name"
                fullWidth
                value={formData.studentName}
                onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Class"
                fullWidth
                select
                value={formData.className}
                onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                sx={{ mb: 2 }}
              >
                {classes.map((className) => (
                  <MenuItem key={className} value={className}>
                    {className}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Reason for Absence"
                fullWidth
                multiline
                rows={3}
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setManualDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleManualEntry} 
              variant="contained"
              disabled={!formData.studentName || !formData.className || !formData.reason}
            >
              Add Absence
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

export default App;

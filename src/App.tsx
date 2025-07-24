import React, { useState, useEffect } from 'react';
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
  Snackbar,
  CircularProgress
} from '@mui/material';
import { Add, Phone } from '@mui/icons-material';
import theme from './theme';
import SchoolBanner from './components/SchoolBanner';
import TodayAbsences from './components/TodayAbsences';
import AbsenceCalendar from './components/AbsenceCalendar';
import AbsenceStats from './components/AbsenceStats';

interface Class {
  id: number;
  name: string;
  teacher_name: string;
  capacity: number;
  created_at: string;
}

function App() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [simulateDialogOpen, setSimulateDialogOpen] = useState(false);
  const [manualDialogOpen, setManualDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [classes, setClasses] = useState<Class[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [validatingStudent, setValidatingStudent] = useState(false);
  
  // Manual entry form state
  const [formData, setFormData] = useState({
    studentName: '',
    className: '',
    reason: ''
  });

  // Fetch classes when manual dialog opens
  useEffect(() => {
    if (manualDialogOpen) {
      fetchClasses();
    }
  }, [manualDialogOpen]);

  const fetchClasses = async () => {
    setLoadingClasses(true);
    try {
      const response = await fetch('http://localhost:5001/api/classes');
      if (!response.ok) {
        throw new Error('Failed to fetch classes');
      }
      const classesData = await response.json();
      setClasses(classesData);
    } catch (error) {
      setSnackbar({ 
        open: true, 
        message: 'Failed to load classes', 
        severity: 'error' 
      });
    } finally {
      setLoadingClasses(false);
    }
  };

  const validateStudent = async (studentName: string, className: string) => {
    try {
      const response = await fetch(`http://localhost:5001/api/students/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentName, className })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Student validation failed');
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      throw error;
    }
  };

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
    if (!formData.studentName.trim() || !formData.className || !formData.reason.trim()) {
      setSnackbar({ 
        open: true, 
        message: 'Please fill in all fields', 
        severity: 'error' 
      });
      return;
    }

    setValidatingStudent(true);
    try {
      // First validate the student exists in the selected class
      await validateStudent(formData.studentName.trim(), formData.className);
      
      // If validation passes, add the absence
      const response = await fetch('http://localhost:5001/api/absences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: formData.studentName.trim(),
          className: formData.className,
          reason: formData.reason.trim(),
          absenceDate: new Date().toISOString().split('T')[0]
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add absence');
      }
      
      setSnackbar({ 
        open: true, 
        message: 'Absence added successfully',
        severity: 'success' 
      });
      setManualDialogOpen(false);
      setFormData({ studentName: '', className: '', reason: '' });
      handleRefresh();
    } catch (error: any) {
      setSnackbar({ 
        open: true, 
        message: error.message || 'Failed to add absence', 
        severity: 'error' 
      });
    } finally {
      setValidatingStudent(false);
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
            <Alert severity="info" sx={{ mb: 2 }}>
              Enter the student's name exactly as it appears in the system. The system will verify the student exists in the selected class before adding the absence.
            </Alert>
            <Box sx={{ pt: 1 }}>
              <TextField
                label="Student Name"
                fullWidth
                value={formData.studentName}
                onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                sx={{ mb: 2 }}
                helperText="Enter the full name of the student"
              />
              <TextField
                label="Class"
                fullWidth
                select
                value={formData.className}
                onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                sx={{ mb: 2 }}
                disabled={loadingClasses}
              >
                {loadingClasses ? (
                  <MenuItem disabled>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Loading classes...
                  </MenuItem>
                ) : (
                  classes.map((classItem) => (
                    <MenuItem key={classItem.id} value={classItem.name}>
                      {classItem.name}
                    </MenuItem>
                  ))
                )}
              </TextField>
              <TextField
                label="Reason for Absence"
                fullWidth
                multiline
                rows={3}
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                helperText="Provide a detailed reason for the absence"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => {
                setManualDialogOpen(false);
                setFormData({ studentName: '', className: '', reason: '' });
              }}
              disabled={validatingStudent}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleManualEntry} 
              variant="contained"
              disabled={!formData.studentName.trim() || !formData.className || !formData.reason.trim() || validatingStudent}
              startIcon={validatingStudent ? <CircularProgress size={20} /> : undefined}
            >
              {validatingStudent ? 'Validating...' : 'Add Absence'}
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

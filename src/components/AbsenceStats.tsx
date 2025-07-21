import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Button,
  TextField,
  Paper,
  Chip,
  Divider
} from '@mui/material';
import { 
  Assessment,
  Class,
  People,
  Download,
  DateRange
} from '@mui/icons-material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';

interface AbsenceStats {
  class_name: string;
  absence_count: number;
  unique_students: number;
  reasons: string;
}

const AbsenceStats: React.FC = () => {
  const [stats, setStats] = useState<AbsenceStats[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Dayjs>(dayjs().subtract(7, 'day'));
  const [endDate, setEndDate] = useState<Dayjs>(dayjs());

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `http://localhost:5001/api/absences/stats?startDate=${startDate.format('YYYY-MM-DD')}&endDate=${endDate.format('YYYY-MM-DD')}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch absence statistics');
      }
      
      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [startDate, endDate]);

  const generateReport = async () => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/absences/range?startDate=${startDate.format('YYYY-MM-DD')}&endDate=${endDate.format('YYYY-MM-DD')}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch absence data');
      }
      
      const data = await response.json();
      
      // Create CSV content
      const csvContent = [
        ['Date', 'Student Name', 'Class', 'Reason', 'Status', 'Reported At'].join(','),
        ...data.map((absence: any) => [
          absence.absence_date,
          absence.student_name,
          absence.class_name,
          absence.reason,
          absence.status,
          new Date(absence.reported_at).toLocaleString()
        ].join(','))
      ].join('\n');
      
      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `absence_report_${startDate.format('YYYY-MM-DD')}_to_${endDate.format('YYYY-MM-DD')}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate report');
    }
  };

  const getClassColor = (className: string) => {
    const colors = {
      'Reception A': '#7FB3D3',
      'Reception B': '#90C695',
      'Year 1 Green': '#90C695',
      'Year 1 Blue': '#7FB3D3',
      'Year 2 Red': '#FF8A80',
      'Year 2 Yellow': '#FFD54F',
    };
    return colors[className as keyof typeof colors] || '#B39DDB';
  };

  const getTotalAbsences = () => stats.reduce((sum, stat) => sum + Number(stat.absence_count), 0);
  const getTotalUniqueStudents = () => stats.reduce((sum, stat) => sum + Number(stat.unique_students), 0);

  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" mb={3}>
          <Assessment sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h5" component="h2">
            Absence Statistics & Reports
          </Typography>
        </Box>

        {/* Date Range Selection */}
        <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Select Date Range
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <Box sx={{ flex: '1 1 300px' }}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={(newValue) => newValue && setStartDate(newValue)}
                  slotProps={{ textField: { size: 'small', fullWidth: true } }}
                />
              </Box>
              <Box sx={{ flex: '1 1 300px' }}>
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={(newValue) => newValue && setEndDate(newValue)}
                  slotProps={{ textField: { size: 'small', fullWidth: true } }}
                />
              </Box>
              <Box sx={{ flex: '1 1 300px' }}>
                <Button
                  variant="outlined"
                  onClick={generateReport}
                  startIcon={<Download />}
                  fullWidth
                  disabled={loading}
                >
                  Export Report
                </Button>
              </Box>
            </Box>
          </LocalizationProvider>
        </Paper>

        {/* Summary Cards */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2, mb: 3 }}>
          <Box>
            <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="primary.main" fontWeight="bold">
                {getTotalAbsences()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Absences
              </Typography>
            </Paper>
          </Box>
          <Box>
            <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="secondary.main" fontWeight="bold">
                {getTotalUniqueStudents()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Students Affected
              </Typography>
            </Paper>
          </Box>
          <Box>
            <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="info.main" fontWeight="bold">
                {stats.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Classes Affected
              </Typography>
            </Paper>
          </Box>
          <Box>
            <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main" fontWeight="bold">
                {stats.length > 0 ? Math.round(getTotalAbsences() / stats.length) : 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg. per Class
              </Typography>
            </Paper>
          </Box>
        </Box>

        {/* Statistics by Class */}
        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : (
          <Box>
            <Typography variant="h6" gutterBottom>
              Statistics by Class
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 2 }}>
              {stats.map((stat) => (
                <Box key={stat.class_name}>
                  <Paper 
                    elevation={1} 
                    sx={{ 
                      p: 2, 
                      borderLeft: `4px solid ${getClassColor(stat.class_name)}`,
                      '&:hover': { 
                        boxShadow: 2,
                        transform: 'translateY(-2px)',
                        transition: 'all 0.2s ease-in-out'
                      }
                    }}
                  >
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Box display="flex" alignItems="center">
                        <Class sx={{ mr: 1, color: getClassColor(stat.class_name) }} />
                        <Typography variant="h6">
                          {stat.class_name}
                        </Typography>
                      </Box>
                      <Chip 
                        label={`${stat.absence_count} absences`}
                        size="small"
                        color={stat.absence_count > 5 ? 'error' : stat.absence_count > 2 ? 'warning' : 'success'}
                      />
                    </Box>
                    
                    <Box display="flex" alignItems="center" mb={2}>
                      <People sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {stat.unique_students} students affected
                      </Typography>
                    </Box>
                    
                    <Divider sx={{ mb: 2 }} />
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Common reasons:
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                      {stat.reasons.split(',').slice(0, 3).map((reason, index) => (
                        <Chip 
                          key={index}
                          label={reason.trim()}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.75rem' }}
                        />
                      ))}
                    </Box>
                  </Paper>
                </Box>
              ))}
            </Box>
            
            {stats.length === 0 && (
              <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
                No absence data available for the selected date range.
              </Typography>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default AbsenceStats;
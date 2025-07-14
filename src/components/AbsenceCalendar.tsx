import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  Badge,
  Tooltip,
  Paper,
  Divider
} from '@mui/material';
import { 
  CalendarMonth, 
  ChevronLeft, 
  ChevronRight,
  PersonOff,
  Class
} from '@mui/icons-material';
import { LocalizationProvider, DateCalendar } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';

interface Absence {
  id: number;
  student_name: string;
  class_name: string;
  reason: string;
  absence_date: string;
  reported_at: string;
  status: string;
}

interface AbsenceCalendarProps {
  onDateSelect?: (date: string) => void;
}

const AbsenceCalendar: React.FC<AbsenceCalendarProps> = ({ onDateSelect }) => {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(dayjs());

  const fetchAbsencesForRange = async (start: Dayjs, end: Dayjs) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `http://localhost:5001/api/absences/range?startDate=${start.format('YYYY-MM-DD')}&endDate=${end.format('YYYY-MM-DD')}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch absences');
      }
      
      const data = await response.json();
      setAbsences(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const monthStart = currentMonth.startOf('month');
    const monthEnd = currentMonth.endOf('month');
    fetchAbsencesForRange(monthStart, monthEnd);
  }, [currentMonth]);

  const getAbsencesForDate = (date: Dayjs) => {
    return absences.filter(absence => 
      dayjs(absence.absence_date).format('YYYY-MM-DD') === date.format('YYYY-MM-DD')
    );
  };

  const getSelectedDateAbsences = () => {
    return getAbsencesForDate(selectedDate);
  };

  const handleDateChange = (date: Dayjs | null) => {
    if (date) {
      setSelectedDate(date);
      onDateSelect?.(date.format('YYYY-MM-DD'));
    }
  };

  const handleMonthChange = (direction: 'prev' | 'next') => {
    const newMonth = direction === 'prev' 
      ? currentMonth.subtract(1, 'month')
      : currentMonth.add(1, 'month');
    setCurrentMonth(newMonth);
  };

  const CustomDay = ({ day, outsideCurrentMonth, ...other }: any) => {
    const dayAbsences = getAbsencesForDate(day);
    const isSelected = selectedDate.format('YYYY-MM-DD') === day.format('YYYY-MM-DD');
    
    return (
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          borderRadius: 1,
          border: isSelected ? '2px solid #7FB3D3' : 'none',
          backgroundColor: isSelected ? 'rgba(127, 179, 211, 0.1)' : 'transparent',
          '&:hover': {
            backgroundColor: 'rgba(127, 179, 211, 0.05)'
          }
        }}
        onClick={() => handleDateChange(day)}
        {...other}
      >
        <Typography 
          variant="body2" 
          color={outsideCurrentMonth ? 'text.disabled' : 'text.primary'}
        >
          {day.date()}
        </Typography>
        {dayAbsences.length > 0 && (
          <Badge
            badgeContent={dayAbsences.length}
            color="error"
            sx={{
              position: 'absolute',
              top: 2,
              right: 2,
              '& .MuiBadge-badge': {
                minWidth: 16,
                height: 16,
                fontSize: '0.75rem'
              }
            }}
          />
        )}
      </Box>
    );
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

  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <CalendarMonth sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h5" component="h2">
            Absence Calendar
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Box sx={{ flex: '1 1 65%', minWidth: 300 }}>
            <Paper elevation={1} sx={{ p: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Button
                  onClick={() => handleMonthChange('prev')}
                  startIcon={<ChevronLeft />}
                  size="small"
                >
                  Previous
                </Button>
                <Typography variant="h6">
                  {currentMonth.format('MMMM YYYY')}
                </Typography>
                <Button
                  onClick={() => handleMonthChange('next')}
                  endIcon={<ChevronRight />}
                  size="small"
                >
                  Next
                </Button>
              </Box>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar
                  value={selectedDate}
                  onChange={handleDateChange}
                  views={['day']}
                  slots={{
                    day: CustomDay
                  }}
                  sx={{
                    '& .MuiPickersDay-root': {
                      borderRadius: 1,
                    },
                    '& .MuiPickersCalendarHeader-root': {
                      display: 'none'
                    }
                  }}
                />
              </LocalizationProvider>
            </Paper>
          </Box>

          <Box sx={{ flex: '1 1 30%', minWidth: 250 }}>
            <Paper elevation={1} sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                {selectedDate.format('MMMM D, YYYY')}
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {loading ? (
                <Box display="flex" justifyContent="center" py={4}>
                  <CircularProgress size={24} />
                </Box>
              ) : error ? (
                <Alert severity="error">
                  {error}
                </Alert>
              ) : (
                <Box>
                  {getSelectedDateAbsences().length === 0 ? (
                    <Typography variant="body2" color="text.secondary" textAlign="center">
                      No absences on this date
                    </Typography>
                  ) : (
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {getSelectedDateAbsences().length} absence(s):
                      </Typography>
                      {getSelectedDateAbsences().map((absence) => (
                        <Box key={absence.id} sx={{ mb: 2 }}>
                          <Box display="flex" alignItems="center" mb={1}>
                            <PersonOff sx={{ 
                              fontSize: 16, 
                              mr: 1, 
                              color: getClassColor(absence.class_name) 
                            }} />
                            <Typography variant="body2" fontWeight="medium">
                              {absence.student_name}
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center" mb={1}>
                            <Class sx={{ fontSize: 14, mr: 1, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                              {absence.class_name}
                            </Typography>
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            {absence.reason}
                          </Typography>
                          <Divider sx={{ mt: 1 }} />
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              )}
            </Paper>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AbsenceCalendar;
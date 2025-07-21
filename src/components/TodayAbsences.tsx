import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  CircularProgress,
  Alert,
  Avatar,
  Divider,
  Button,
  Tooltip
} from '@mui/material';
import {
  PersonOff,
  Class,
  Phone,
  Refresh,
  Warning,
  CheckCircle,
  Delete
} from '@mui/icons-material';

interface Absence {
  id: number;
  student_name: string;
  class_name: string;
  reason: string;
  absence_date: string;
  reported_at: string;
  phone_system_call_id: string | null;
  status: 'reported' | 'pending verification';
  notes: string | null;
}

interface TodayAbsencesProps {
  onRefresh?: () => void;
}

const TodayAbsences: React.FC<TodayAbsencesProps> = ({ onRefresh }) => {
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodayAbsences = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:5001/api/absences/today');
      
      if (!response.ok) {
        throw new Error('Failed to fetch today\'s absences');
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
    fetchTodayAbsences();
  }, []);

  const handleRefresh = () => {
    fetchTodayAbsences();
    onRefresh?.();
  };

  const handleDeleteAbsence = async (absenceId: number) => {
    try {
      const response = await fetch(`http://localhost:5001/api/absences/${absenceId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete absence');
      }

      // Refresh the data after successful deletion
      fetchTodayAbsences();
      onRefresh?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete absence');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'reported': return 'success';
      case 'pending verification': return 'warning';
      default: return 'success';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'reported': return <CheckCircle />;
      case 'pending verification': return <Warning />;
      default: return <CheckCircle />;
    }
  };

  const getStatusText = (status: string) => {
    return status;
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

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Button onClick={handleRefresh} variant="outlined" startIcon={<Refresh />}>
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box display="flex" alignItems="center">
            <PersonOff sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h5" component="h2">
              Today's Absences
            </Typography>
          </Box>
          <Box>
            <Chip 
              label={`${absences.length} absent`}
              color={absences.length > 0 ? 'warning' : 'success'}
              sx={{ mr: 1 }}
            />
            <Tooltip title="Refresh data">
              <Button onClick={handleRefresh} size="small" sx={{ minWidth: 'auto', p: 1 }}>
                <Refresh />
              </Button>
            </Tooltip>
          </Box>
        </Box>

        {absences.length === 0 ? (
          <Box textAlign="center" py={4}>
            <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No absences reported today
            </Typography>
            <Typography variant="body2" color="text.secondary">
              All students are present!
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 2 }}>
            {absences.map((absence) => (
              <Box key={absence.id}>
                <Card variant="outlined" sx={{ 
                  borderLeft: `4px solid ${getClassColor(absence.class_name)}`,
                  '&:hover': { 
                    boxShadow: 2,
                    transform: 'translateY(-2px)',
                    transition: 'all 0.2s ease-in-out'
                  }
                }}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                      <Box display="flex" alignItems="center">
                        <Avatar sx={{ 
                          bgcolor: getClassColor(absence.class_name),
                          width: 40,
                          height: 40,
                          mr: 2
                        }}>
                          {absence.student_name.split(' ').map(n => n[0]).join('')}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" component="h3">
                            {absence.student_name}
                          </Typography>
                          <Box display="flex" alignItems="center" mt={0.5}>
                            <Class sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {absence.class_name}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Chip
                          icon={getStatusIcon(absence.status)}
                          label={getStatusText(absence.status)}
                          color={getStatusColor(absence.status)}
                          size="small"
                        />
                        <Tooltip title="Delete absence">
                          <Button
                            size="small"
                            color="error"
                            onClick={() => handleDeleteAbsence(absence.id)}
                            sx={{ minWidth: 'auto', p: 0.5 }}
                          >
                            <Delete fontSize="small" />
                          </Button>
                        </Tooltip>
                      </Box>
                    </Box>

                    <Divider sx={{ my: 1 }} />

                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Reason for absence:
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        {absence.reason}
                      </Typography>
                      
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="caption" color="text.secondary">
                          Reported: {new Date(absence.reported_at).toLocaleTimeString('en-GB', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </Typography>
                        {absence.phone_system_call_id && (
                          <Tooltip title="Reported via phone system">
                            <Phone sx={{ fontSize: 16, color: 'primary.main' }} />
                          </Tooltip>
                        )}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default TodayAbsences;
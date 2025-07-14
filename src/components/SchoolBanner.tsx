import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  Container,
  Paper
} from '@mui/material';
import { School, Dashboard } from '@mui/icons-material';

const SchoolBanner: React.FC = () => {
  return (
    <AppBar position="static" elevation={0} sx={{ 
      background: 'linear-gradient(135deg, #7FB3D3 0%, #90C695 50%, #B39DDB 100%)',
      mb: 3
    }}>
      <Container maxWidth="xl">
        <Toolbar sx={{ py: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            {/* School Logo */}
            <Paper sx={{ 
              p: 1.5, 
              mr: 3, 
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <School sx={{ fontSize: 40, color: '#2C3E50' }} />
            </Paper>

            {/* School Name and Title */}
            <Box>
              <Typography 
                variant="h4" 
                component="h1" 
                sx={{ 
                  fontWeight: 700,
                  color: 'white',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                  mb: 0.5
                }}
              >
                University of Cambridge Primary School
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Dashboard sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.9)' }} />
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontWeight: 400
                  }}
                >
                  Absence Tracking Dashboard
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Date and Time */}
          <Box sx={{ textAlign: 'right' }}>
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: 500
              }}
            >
              {new Date().toLocaleDateString('en-GB', { 
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.8)',
                mt: 0.5
              }}
            >
              {new Date().toLocaleTimeString('en-GB', { 
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Typography>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default SchoolBanner;
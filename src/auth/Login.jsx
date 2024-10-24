import React from 'react';
import {
  ThemeProvider,
  CssBaseline,
  Typography,
  AppBar,
  Toolbar,
  Container,
  Box,
  Paper,
  useMediaQuery,
  LinearProgress,
  Fade,
  Button,
} from "@mui/material";
import { Database, Server, Shield, LogIn } from "lucide-react";
import { styled } from '@mui/material/styles';
import logoImage from '../images/Watermark_Project_rechts_24pxPNG.png';

// Styled components
const LoginContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  display: 'flex',
  flexDirection: 'column',
}));

const LoginCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  maxWidth: '400px',
  width: '90%',
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const Logo = styled('img')({
  height: '40px',
  marginRight: '16px',
});

const StyledButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5, 4),
  borderRadius: theme.spacing(3),
  textTransform: 'none',
  fontSize: '1.1rem',
  fontWeight: 600,
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
  },
}));

const Login = ({ 
  theme, 
  onLogin, 
  isAppIDInitialized, 
  errorState, 
  errorMessage, 
  isLoading 
}) => {
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LoginContainer>
        <AppBar position="static" elevation={0} sx={{ background: 'transparent' }}>
          <Toolbar>
            <Box display="flex" alignItems="center">
              <Logo src={logoImage} alt="Infocare Logo" />
              <Typography variant="h6" component="div">
                Infocare
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>

        <Container 
          sx={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            py: 4
          }}
        >
          <Fade in timeout={1000}>
            <LoginCard elevation={isSmallScreen ? 2 : 8}>
              <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
                <Logo src={logoImage} alt="Infocare Logo" sx={{ height: '60px' }} />
                <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                  <Typography variant="h4" component="h1" gutterBottom>
                    Welcome to Infocare
                  </Typography>
                  <Typography variant="body1" color="text.secondary" align="center">
                    Monitor and manage your databases with ease
                  </Typography>
                </Box>

                <Box display="flex" gap={4} mb={3}>
                  <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                    <Server size={24} color={theme.palette.primary.main} />
                    <Typography variant="body2">Real-time</Typography>
                  </Box>
                  <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                    <Shield size={24} color={theme.palette.secondary.main} />
                    <Typography variant="body2">Secure</Typography>
                  </Box>
                  <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                    <Database size={24} color={theme.palette.primary.main} />
                    <Typography variant="body2">Reliable</Typography>
                  </Box>
                </Box>

                <StyledButton
                  variant="contained"
                  size="large"
                  onClick={onLogin}
                  disabled={!isAppIDInitialized || isLoading}
                  fullWidth
                  startIcon={<LogIn />}
                >
                  {isLoading ? 'Signing in...' : (isAppIDInitialized ? 'Sign in with IBM' : 'Initializing...')}
                </StyledButton>

                {isLoading && (
                  <LinearProgress 
                    sx={{ 
                      width: '100%', 
                      borderRadius: 1,
                      '& .MuiLinearProgress-bar': {
                        background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                      }
                    }} 
                  />
                )}

                {errorState && (
                  <Typography 
                    color="error" 
                    variant="body2" 
                    align="center"
                    sx={{ mt: 2 }}
                  >
                    {errorMessage}
                  </Typography>
                )}
              </Box>
            </LoginCard>
          </Fade>
        </Container>
      </LoginContainer>
    </ThemeProvider>
  );
};

export default Login;
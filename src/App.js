import React, { useState, useMemo, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import AppID from 'ibmcloud-appid-js';
import { CssBaseline, ThemeProvider, Button, Typography, Box, AppBar, Toolbar, Container } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Management from "./scenes/management";
import Users from "./scenes/users";
import Technical from "./scenes/technical";
import Form from "./scenes/form";
import ManagementDetails from './scenes/management/management_details';
import TechnicalDetails from './scenes/technical/technical_details';
import Recovery from './scenes/management/recovery';
import RecoveryDrp from './scenes/management/recover_drp';
import RecoveryBackups from './scenes/management/recover_backups';
import RecoveryLogging from './scenes/management/recover_logging';
import Recover from './scenes/technical/technical_recover';
import Efficiency from './scenes/technical/efficiency';
import Organization from './scenes/technical/organization';
import Security from './scenes/management/security';
import SecurityEncryption from './scenes/management/security_encryption';
import SecurityUsers from './scenes/management/security_users';
import SecurityMasking from './scenes/management/security_masking';
import Availability from './scenes/technical/availability';
import FAQ from "./scenes/faq";
import Responsiveness from './scenes/management/responsiveness';
import ResponsivenessCpu from './scenes/management/responsiveness_cpu';
import ResponsivenessMemory from './scenes/management/responsiveness_memory';
import ResponsivenessSpace from './scenes/management/responsiveness_space';
import ResponsivenessSpeed from './scenes/management/responsiveness_speed';
import ResponsivenessReadyness from './scenes/management/responsiveness_readyness';
import Calendar from "./scenes/calendar/calendar";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  // AppID Authentication
  const appID = useMemo(() => new AppID(), []);
  const [errorState, setErrorState] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [isAppIDInitialized, setIsAppIDInitialized] = useState(false);
  const [accessToken, setAccessToken] = useState(null);  

  useEffect(() => {
    const initAppID = async () => {
      try {
        await appID.init({
          clientId: 'a1aecd93-e29f-4359-8dc0-953460f71acd',
          discoveryEndpoint: 'https://eu-de.appid.cloud.ibm.com/oauth/v4/facad6f3-96d0-4451-beda-e2b7dbc2df61/.well-known/openid-configuration'
        });
        setIsAppIDInitialized(true);
      } catch (e) {
        setErrorState(true);
        setErrorMessage('Failed to initialize AppID: ' + e.message);
      }
    };
    initAppID();
  }, [appID]);

  const loginAction = async () => {
    if (!isAppIDInitialized) {
      setErrorState(true);
      setErrorMessage('AppID is not initialized yet. Please try again in a moment.');
      return;
    }

    try {
      const tokens = await appID.signin();
      setErrorState(false);
      setIsAuthenticated(true);
      setUserName(tokens.idTokenPayload.name);
      setAccessToken(tokens.accessToken);  
      localStorage.setItem('accessToken', tokens.accessToken);
      console.log("Access token:", tokens.accessToken);     
    } catch (e) {
      setErrorState(true);
      setErrorMessage('Login failed: ' + e.message);
    }
  };

  if (!isAuthenticated) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Infocare
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth="sm" style={{ textAlign: 'center', marginTop: '10%' }}>
          <Typography variant="h4" gutterBottom>
            Welcome to Infocare
          </Typography>
          <Typography variant="body1" gutterBottom>
            Please login to continue
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={loginAction}
            disabled={!isAppIDInitialized}
            style={{ marginTop: '20px' }}
          >
            {isAppIDInitialized ? 'Login' : 'Initializing...'}
          </Button>
          {errorState && <Typography color="error" style={{ marginTop: '20px' }}>{errorMessage}</Typography>}
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} userName={userName} />
            <Routes>
              <Route path="/" element={<Dashboard accessToken={accessToken} />} />
              <Route path="/management" element={<Management />} />
              <Route path="/management/details/:databaseName" element={<ManagementDetails />} />
              <Route path="/management/details/:databaseName/responsiveness" element={<Responsiveness />} />
              <Route path="/management/details/:databaseName/responsiveness/cpu" element={<ResponsivenessCpu />} />
              <Route path="/management/details/:databaseName/responsiveness/memory" element={<ResponsivenessMemory />} />
              <Route path="/management/details/:databaseName/responsiveness/space" element={<ResponsivenessSpace />} />
              <Route path="/management/details/:databaseName/responsiveness/speed" element={<ResponsivenessSpeed />} />
              <Route path="/management/details/:databaseName/responsiveness/readyness" element={<ResponsivenessReadyness />} />
              <Route path="/management/details/:databaseName/security" element={<Security />} />
              <Route path="/management/details/:databaseName/security/encryption" element={<SecurityEncryption />} />
              <Route path="/management/details/:databaseName/security/users" element={<SecurityUsers />} />
              <Route path="/management/details/:databaseName/security/masking" element={<SecurityMasking />} />
              <Route path="/management/details/:databaseName/recovery" element={<Recovery />} />
              <Route path="/management/details/:databaseName/recovery/drp" element={<RecoveryDrp />} />
              <Route path="/management/details/:databaseName/recovery/backups" element={<RecoveryBackups />} />
              <Route path="/management/details/:databaseName/recovery/logging" element={<RecoveryLogging />} />
              <Route path="/technical" element={<Technical />} />
              <Route path="/technical/details/:databaseName" element={<TechnicalDetails />} />
              <Route path="/technical/details/:databaseName/availability" element={<Availability />} />
              <Route path="/technical/details/:databaseName/efficiency" element={<Efficiency />} />
              <Route path="/technical/details/:databaseName/organization" element={<Organization />} />
              <Route path="/technical/details/:databaseName/technical_recover" element={<Recover />} />
              <Route path="/users" element={<Users />} />
              <Route path="/form" element={<Form />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/calendar" element={<Calendar />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;

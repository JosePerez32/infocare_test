import { useState } from "react";
import { Routes, Route } from "react-router-dom";
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
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Calendar from "./scenes/calendar/calendar";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
            <Routes>
              <Route path="/" element={<Dashboard />} />
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
              <Route path="/technical/details/:databaseName" element={<TechnicalDetails/>} />
              <Route path="/technical/details/:databaseName/availability" element={<Availability />} />
              <Route path="/technical/details/:databaseName/efficiency" element={<Efficiency />} />
              <Route path="/technical/details/:databaseName/organization" element={<Organization />} />
              <Route path="/technical/details/details/:databaseName/technical_recover" element={<Recover/>} />
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
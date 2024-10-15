import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Management from "./scenes/management";
import Invoices from "./scenes/invoices";
import Technical from "./scenes/technical";
import Bar from "./scenes/bar";
import Form from "./scenes/form";
import Line from "./scenes/line";
import ManagementDetails from './scenes/management/management_details';
import TechnicalDetails from './scenes/technical/technical_details';
import Recovery from './scenes/management/recover';
import Recover from './scenes/technical/technical_recover';
import Efficiency from './scenes/technical/efficiency';
import Organization from './scenes/technical/organization';
import Security from './scenes/management/security';
import Availibility from './scenes/technical/availability';
import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";
import Responsiveness from './scenes/management/responsiveness';
import ResponsivenessCpu from './scenes/management/responsiveness_cpu';
import ResponsivenessMemory from './scenes/management/responsiveness_memory';
import Geography from "./scenes/geography";
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
              <Route path="/technical" element={<Technical />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/form" element={<Form />} />
              <Route path="/bar" element={<Bar />} />
              <Route path="/pie" element={<Pie />} />
              <Route path="/management_details/:databaseName" element={<ManagementDetails/>} />
              <Route path="/technical_details/:databaseName" element={<TechnicalDetails/>} />
              <Route path="/responsiveness/:databaseName" element={<Responsiveness />} />
              <Route path="/responsiveness_cpu/:databaseName" element={<ResponsivenessCpu />} />
              <Route path="/responsiveness_memory/:databaseName" element={<ResponsivenessMemory />} />
              <Route path="/availability/:databaseName" element={<Availibility />} />
              <Route path="/efficiency/:databaseName" element={<Efficiency />} />
              <Route path="/security/:databaseName" element={<Security />} />
              <Route path="/recovery/:databaseName" element={<Recovery />} />
              <Route path="/organization/:databaseName" element={<Organization />} />
              <Route path="/technical_recover/:databaseName" element={<Recover/>} />
              <Route path="/line" element={<Line />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/geography" element={<Geography />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;

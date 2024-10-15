import { Box, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";


const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="INFOCARE" subtitle="Welcome to Infocare" />
        
      </Box>

         {/* ROW 1 */}
      <Box
        gridColumn="span 3"
        backgroundColor={colors.primary[400]}
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="200px" // Set a fixed height here
      >
        <img src="./assets/infoCare_Logo_v2.png" alt="Logo" style={{ maxHeight: "100%", maxWidth: "100%" }} />
      </Box>

     </Box>
  );
};

export default Dashboard;

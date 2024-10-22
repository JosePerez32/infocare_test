import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import GaugeComponent from "react-gauge-component";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useParams, useNavigate, useLocation } from "react-router-dom";

const Recovery = () => {
  const { databaseName } = useParams(); // Get database name from the URL
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const { organization } = useLocation().state || {};
  const { source } = useParams(); // Retrieve source from the URL parameters
  const [recoveryData, setRecoveryData] = useState({
    drp: 0,
    logging: 0,
    backups: 0,
  });
 
 

  useEffect(() => {
    const fetchRecoveryData = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve token from localStorage

        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/dashboards/${organization}/management/sources/${source}/recovery`, 
          {
            headers: {
              'Authorization': `Bearer ${token}`, // Add token to Authorization header
              'Content-Type': 'application/json',
            },
          }
        );  
        const data = await response.json();
        setRecoveryData({
          drp: data.drp,
          logging: data.logging,
          backups: data.backups,
         
        });
    

        console.log(data); // Check the fetched data
      } catch (error) {
        console.error("Error fetching recovery data:", error);
      }
    };

    fetchRecoveryData();
    const interval = setInterval(fetchRecoveryData, 5000);

    return () => clearInterval(interval);
  }, [databaseName, organization,source]);

  
  const RecoveryBox = ({ title, value, route }) => (
    <Box
      onClick={() => navigate(`/management/details/${databaseName}/recovery/${route}`)}
      style={{
        cursor: "pointer",
        backgroundColor: colors.primary[400],
        padding: "20px",
        borderRadius: "8px"
      }}
    >
      <Typography variant="h6" color={colors.grey[100]}>
        {title}
      </Typography>
      <GaugeComponent
        value={value}
        type="radial"
        arc={{
          colorArray: [ '#EA4228' ,'#5BE12C'],
          subArcs: [{ limit: 10 }, { limit: 30 }, {}, {}, {}],
          padding: 0.02,
          width: 0.3
        }}
      />
    </Box>
  );

  return (
    <Box m="20px">
      <Header title={`Recovery Details for ${databaseName}`} subtitle="Overall Recovery" />
      <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap="20px">
        <RecoveryBox title="DRP" value={recoveryData.drp} route="drp" />
        <RecoveryBox title="Logging" value={recoveryData.logging} route="logging" />
        <RecoveryBox title="Backups" value={recoveryData.backups} route="backups" />
      </Box>
    </Box>
  );
};

export default Recovery;

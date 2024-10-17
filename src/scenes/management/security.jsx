import { Box, useTheme, Typography } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import GaugeComponent from "react-gauge-component";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const Security = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { databaseName } = useParams(); // Get the database name from URL params
  const navigate = useNavigate();

  const [securityData, setSecurityData] = useState({
    encryption: 0,
    users: 0,
    masking: 0,
    
  });


  useEffect(() => {
    const fetchSecurityData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:3001/api/security/${databaseName}`);
        const data = await response.json();
        setSecurityData({
          encryption: data.security.encryption,
          users: data.security.users,
          masking: data.security.masking,
         
        });
      } catch (error) {
        console.error("Error fetching security data:", error);
      }
    };

    // Fetch the data immediately
    fetchSecurityData();

    // Set up interval to fetch data every 5 seconds
    const interval = setInterval(fetchSecurityData, 5000);

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, [databaseName]); // Re-run if databaseName changes

  const SecurityBox = ({ title, value, route }) => (
    <Box
      onClick={() => navigate(`/management/details/${databaseName}/security/${route}`)}
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
      <Header title={`Security Details for ${databaseName}`} subtitle="Overall Security" />
      <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap="20px">
        <SecurityBox title="Encryption" value={securityData.encryption} route="encryption" />
        <SecurityBox title="Masking" value={securityData.masking} route="masking" />
        <SecurityBox title="Users" value={securityData.users} route="users" />
        
      </Box>
    </Box>
  );
};

export default Security;

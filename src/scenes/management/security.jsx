    import { Box, useTheme, Typography } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import GaugeComponent from "react-gauge-component";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Security = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { databaseName } = useParams(); // Get the database name from URL params
  const [encryptionData, setEncryptionData] = useState(null);
  const [usersData, setUsersData] = useState(null);
  const [maskingData, setMaskingData] = useState(null);

  useEffect(() => {
    const fetchSecurityData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:3001/api/security/${databaseName}`);
        const data = await response.json();
        setEncryptionData(data.security.encryption);
        setUsersData(data.security.users);
        setMaskingData(data.security.masking);
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

  return (
    <Box m="20px">
      <Header title={`Security for ${databaseName}`} subtitle="Security" />
      <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap="20px">
        <Box
          style={{
            backgroundColor: colors.primary[400],
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <Typography variant="h6" color={colors.grey[100]}>
            Encryption
          </Typography>
          {encryptionData !== null ? ( // Only render GaugeComponent if data is available
            <GaugeComponent
              value={encryptionData}
              type="radial"
              arc={{
                colorArray: ["#5BE12C", "#EA4228"],
                subArcs: [{ limit: 10 }, { limit: 30 }, {}, {}, {}],
                padding: 0.02,
                width: 0.3,
              }}
            />
          ) : (
            <Typography color={colors.grey[100]}>Loading...</Typography>
          )}
        </Box>

        <Box
          style={{
            backgroundColor: colors.primary[400],
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <Typography variant="h6" color={colors.grey[100]}>
            Users
          </Typography>
          {usersData !== null ? ( // Only render GaugeComponent if data is available
            <GaugeComponent
              value={usersData}
              type="radial"
              arc={{
                colorArray: ["#5BE12C", "#EA4228"],
                subArcs: [{ limit: 10 }, { limit: 30 }, {}, {}, {}],
                padding: 0.02,
                width: 0.3,
              }}
            />
          ) : (
            <Typography color={colors.grey[100]}>Loading...</Typography>
          )}
        </Box>

        <Box
          style={{
            backgroundColor: colors.primary[400],
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <Typography variant="h6" color={colors.grey[100]}>
            Masking
          </Typography>
          {maskingData !== null ? ( // Only render GaugeComponent if data is available
            <GaugeComponent
              value={maskingData}
              type="radial"
              arc={{
                colorArray: ["#5BE12C", "#EA4228"],
                subArcs: [{ limit: 10 }, { limit: 30 }, {}, {}, {}],
                padding: 0.02,
                width: 0.3,
              }}
            />
          ) : (
            <Typography color={colors.grey[100]}>Loading...</Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Security;

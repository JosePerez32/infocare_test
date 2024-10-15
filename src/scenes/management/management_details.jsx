import { Box, useTheme, Typography } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import GaugeComponent from "react-gauge-component";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate

const ManagementDetails = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { databaseName } = useParams(); // Get the database name from URL params
  const navigate = useNavigate(); // Initialize the navigate function
  const [recoveryData, setRecoveryData] = useState(null);

  useEffect(() => {
    const fetchRecoveryData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:3001/api/management/details/${databaseName}`);
        const data = await response.json();
        setRecoveryData(data.recovery);
      } catch (error) {
        console.error("Error fetching recovery data:", error);
      }
    };

    fetchRecoveryData();
  }, [databaseName]);

  if (!recoveryData) return <Typography>Loading...</Typography>;

  return (
    <Box m="20px">
      <Header title={`Details for ${recoveryData.database}`} subtitle="Details" />
      <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap="20px">
        <Box
          onClick={() => navigate(`/responsiveness/${databaseName}`)} // Navigate to Responsiveness component
          style={{ cursor: "pointer", backgroundColor: colors.primary[400], padding: "20px", borderRadius: "8px" }} // Change background color, padding, and border radius
        >
          <Typography variant="h6" color={colors.grey[100]}>
            Responsiveness
          </Typography>
          <GaugeComponent
            value={recoveryData.responsiveness}
            type="radial"
            arc={{
              colorArray: ['#5BE12C', '#EA4228'],
              subArcs: [{ limit: 10 }, { limit: 30 }, {}, {}, {}],
              padding: 0.02,
              width: 0.3
            }}
          />
        </Box>
        <Box  onClick={() => navigate(`/security/${databaseName}`)} style={{             cursor: "pointer",
backgroundColor: colors.primary[400], padding: "20px", borderRadius: "8px" }}>
          <Typography variant="h6" color={colors.grey[100]}>
            Security
          </Typography>
          <GaugeComponent
            value={recoveryData.security}
            type="radial"
            arc={{
              colorArray: ['#5BE12C', '#EA4228'],
              subArcs: [{ limit: 10 }, { limit: 30 }, {}, {}, {}],
              padding: 0.02,
              width: 0.3
            }}
          />
        </Box>
        <Box onClick={() => navigate(`/recovery/${databaseName}`)} // Navigate to Responsiveness component
        style={{ backgroundColor: colors.primary[400], padding: "20px", borderRadius: "8px" }}>
          <Typography variant="h6" color={colors.grey[100]}>
            Recovery
          </Typography>
          <GaugeComponent
            value={recoveryData.recovery}
            type="radial"
            arc={{
              colorArray: ['#5BE12C', '#EA4228'],
              subArcs: [{ limit: 10 }, { limit: 30 }, {}, {}, {}],
              padding: 0.02,
              width: 0.3
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ManagementDetails;

import { Box, useTheme, Typography } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import GaugeComponent from "react-gauge-component";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const TechnicalDetails = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { databaseName } = useParams();
  const navigate = useNavigate();
  const [detailsData, setDetailsData] = useState(null);

  useEffect(() => {
    const fetchDetailsData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:3001/api/technical/details/${databaseName}`);
        const data = await response.json();
        setDetailsData(data);
      } catch (error) {
        console.error("Error fetching details data:", error);
      }
    };

    fetchDetailsData();
  }, [databaseName]);

  if (!detailsData) return <Typography>Loading...</Typography>;

  const handleBoxClick = (route) => {
    navigate(`/technical/details/${databaseName}/${route}`);
  };

  const GaugeBox = ({ title, value, route }) => (
    <Box
      onClick={() => handleBoxClick(route)}
      style={{
        cursor: "pointer",
        backgroundColor: colors.primary[400],
        padding: "20px",
        borderRadius: "8px",
      }}
    >
      <Typography variant="h6" color={colors.grey[100]}>
        {title}
      </Typography>
      <GaugeComponent
        value={value}
        type="radial"
        arc={{
          colorArray: ['#5BE12C', '#EA4228'],
          subArcs: [{ limit: 10 }, { limit: 30 }, {}, {}, {}],
          padding: 0.02,
          width: 0.3
        }}
      />
    </Box>
  );

  return (
    <Box m="20px">
      <Header title={`Details for ${databaseName}`} subtitle="Details" />
      <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap="20px">
        <GaugeBox title="Availability" value={detailsData.availability} route="availability" />
        <GaugeBox title="Efficiency" value={detailsData.efficiency} route="efficiency" />
        <GaugeBox title="Security" value={detailsData.security} route="security" />
        <GaugeBox title="Organization" value={detailsData.organization} route="organization" />
      </Box>
    </Box>
  );
};

export default TechnicalDetails;
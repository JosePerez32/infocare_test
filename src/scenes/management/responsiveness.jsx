import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import GaugeComponent from "react-gauge-component";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useParams, useNavigate } from "react-router-dom";

const Responsiveness = () => {
  const { databaseName } = useParams();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [responsiveData, setResponsiveData] = useState({
    cpu: 0,
    memory: 0,
    space: 0,
    speed: 0,
    readiness: 0
  });

  useEffect(() => {
    const fetchResponsivenessData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:3001/api/responsiveness/${databaseName}`);
        const data = await response.json();
        setResponsiveData({
          cpu: data.responsiveness.cpu,
          memory: data.responsiveness.memory,
          space: data.responsiveness.space,
          speed: data.responsiveness.speed,
          readiness: data.responsiveness.readinessData
        });
        console.log(data);
      } catch (error) {
        console.error("Error fetching responsiveness data:", error);
      }
    };

    fetchResponsivenessData();
    const interval = setInterval(fetchResponsivenessData, 5000);

    return () => clearInterval(interval);
  }, [databaseName]);

  const ResponsivenessBox = ({ title, value, route }) => (
    <Box
      onClick={() => navigate(`/management/details/${databaseName}/responsiveness/${route}`)}
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
      <Header title={`Responsiveness Details for ${databaseName}`} subtitle="Overall Responsiveness" />
      <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap="20px">
        <ResponsivenessBox title="CPU Usage" value={responsiveData.cpu} route="cpu" />
        <ResponsivenessBox title="Memory Usage" value={responsiveData.memory} route="memory" />
        <ResponsivenessBox title="Space Usage" value={responsiveData.space} route="space" />
        <ResponsivenessBox title="Speed" value={responsiveData.speed} route="speed" />
        <ResponsivenessBox title="Readyness" value={responsiveData.readyness} route="readyness" />
      </Box>
    </Box>
  );
};

export default Responsiveness;
import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import GaugeComponent from "react-gauge-component";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom'; // Import useNavigate


const Responsiveness = () => {
  const { databaseName } = useParams(); // Get database name from the URL
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate(); // Initialize the navigate function
  const [cpuUsage, setCpuUsage] = useState(0);
  const [spaceData, setSpaceData] = useState([]);
  const [memoryData, setMemoryData] = useState([]);
  const [speedData, setSpeedData] = useState([]);
  const [readinessData, setReadinessData] = useState([]);



  useEffect(() => {
    const fetchCpuData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:3001/api/responsiveness/${databaseName}`);
        const data = await response.json();
        setCpuUsage(data.responsiveness.cpu);
        setMemoryData(data.responsiveness.memory);
        setSpaceData(data.responsiveness.space);
        setSpeedData(data.responsiveness.speed);
        setReadinessData(data.responsiveness.readinessData);



        console.log(data); // Check the fetched data
      } catch (error) {
        console.error("Error fetching responsiveness data:", error);
      }
    };

    fetchCpuData();
    const interval = setInterval(fetchCpuData, 5000);

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, [databaseName]);  // Re-run if databaseName changes

  return (

    <Box m="20px">
      <Header title={`Memory Usage for ${databaseName}`} subtitle="Memory Usage" />
      <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap="20px">
        <Box onClick={() => navigate(`/responsiveness_memory/${databaseName}`)}
          style={{ cursor: "pointer", backgroundColor: colors.primary[400], padding: "20px", borderRadius: "8px" }} // Change background color, padding, and border radius
        >
          <Typography variant="h6" color={colors.grey[100]}>
            Memory Usage
          </Typography>
          <GaugeComponent
            value={memoryData}
            type="radial"
            arc={{
              colorArray: ['#5BE12C', '#EA4228'],
              subArcs: [{ limit: 10 }, { limit: 30 }, {}, {}, {}],
              padding: 0.02,
              width: 0.3
            }}
          />
        </Box>
        <Box  style={{             cursor: "pointer",
backgroundColor: colors.primary[400], padding: "20px", borderRadius: "8px" }}>
          <Typography variant="h6" color={colors.grey[100]}>
          Space Usage
          </Typography>
          <GaugeComponent
            value={spaceData}
            type="radial"
            arc={{
              colorArray: ['#5BE12C', '#EA4228'],
              subArcs: [{ limit: 10 }, { limit: 30 }, {}, {}, {}],
              padding: 0.02,
              width: 0.3
            }}
          />
        </Box>
        <Box onClick={() => navigate(`/responsiveness_cpu/${databaseName}`)}
        style={{ backgroundColor: colors.primary[400], padding: "20px", borderRadius: "8px" }}>
          <Typography variant="h6" color={colors.grey[100]}>
            CPU Usage
          </Typography>
          <GaugeComponent
            value={cpuUsage}
            type="radial"
            arc={{
              colorArray: ['#5BE12C', '#EA4228'],
              subArcs: [{ limit: 10 }, { limit: 30 }, {}, {}, {}],
              padding: 0.02,
              width: 0.3
            }}
          />
        </Box>

        <Box 
        style={{ backgroundColor: colors.primary[400], padding: "20px", borderRadius: "8px" }}>
          <Typography variant="h6" color={colors.grey[100]}>
            Speed Usage
          </Typography>
          <GaugeComponent
            value={speedData}
            type="radial"
            arc={{
              colorArray: ['#5BE12C', '#EA4228'],
              subArcs: [{ limit: 10 }, { limit: 30 }, {}, {}, {}],
              padding: 0.02,
              width: 0.3
            }}
          />
        </Box>

        <Box 
        style={{ backgroundColor: colors.primary[400], padding: "20px", borderRadius: "8px" }}>
          <Typography variant="h6" color={colors.grey[100]}>
            Readyness
          </Typography>
          <GaugeComponent
            value={readinessData}
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

export default Responsiveness;

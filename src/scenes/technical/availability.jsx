import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import GaugeComponent from "react-gauge-component";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useParams } from "react-router-dom";

const Availability = () => {
  const { databaseName } = useParams(); // Get database name from the URL
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [responseData, setResponseData] = useState(0);
  const [memoryData, setMemoryData] = useState([]);
  const [spaceData, setSpaceData] = useState([]);
 

  useEffect(() => {
    const fetchAvailibilityData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:3001/api/availability/${databaseName}`);
        const data = await response.json();
        setResponseData(data.recovery.response);
        setMemoryData(data.recovery.memory);
        setSpaceData(data.recovery.space);
    

        console.log(data); // Check the fetched data
      } catch (error) {
        console.error("Error fetching recovery data:", error);
      }
    };

    fetchAvailibilityData();
  }, [databaseName]);

  return (

    <Box m="20px">
      <Header title={`Availibility for ${databaseName}`} subtitle="Availibility" />
      <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap="20px">
        <Box
          style={{ cursor: "pointer", backgroundColor: colors.primary[400], padding: "20px", borderRadius: "8px" }} // Change background color, padding, and border radius
        >
          <Typography variant="h6" color={colors.grey[100]}>
            Response
          </Typography>
          <GaugeComponent
            value={responseData}
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
          Memory
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
        <Box 
        style={{ cursor: "pointer", backgroundColor: colors.primary[400], padding: "20px", borderRadius: "8px" }}>
          <Typography variant="h6" color={colors.grey[100]}>
            Space
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
      </Box>
    </Box>
  );
};

export default Availability;

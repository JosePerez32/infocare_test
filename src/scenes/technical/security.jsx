import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import GaugeComponent from "react-gauge-component";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useParams } from "react-router-dom";

const Security = () => {
  const { databaseName } = useParams(); // Get database name from the URL
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [publicData, setPublicData] = useState(0);
  const [usersData, setUsersData] = useState([]);
  const [sslData, setsslData] = useState([]);
 

  useEffect(() => {
    const fetchSecurityData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:3001/api/technical/security/${databaseName}`);
        const data = await response.json();
        setPublicData(data.public);
        setUsersData(data.users);
        setsslData(data.ssl);
    

        console.log(data); // Check the fetched data
      } catch (error) {
        console.error("Error fetching recovery data:", error);
      }
    };

    fetchSecurityData();
  }, [databaseName]);

  return (

    <Box m="20px">
      <Header title={`Efficiency for ${databaseName}`} subtitle="Efficiency" />
      <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap="20px">
        <Box
          style={{ cursor: "pointer", backgroundColor: colors.primary[400], padding: "20px", borderRadius: "8px" }} // Change background color, padding, and border radius
        >
          <Typography variant="h6" color={colors.grey[100]}>
            Public
          </Typography>
          <GaugeComponent
            value={publicData}
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
          Users
          </Typography>
          <GaugeComponent
            value={usersData}
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
            SSL
          </Typography>
          <GaugeComponent
            value={sslData}
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
            Scripts
          </Typography>
          <GaugeComponent
            value={scriptsData}
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

export default Security;

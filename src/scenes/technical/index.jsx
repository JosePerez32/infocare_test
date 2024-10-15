import { Box, useTheme, Typography } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import GaugeComponent from 'react-gauge-component';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Technical = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [gaugeData, setGaugeData] = useState([]);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const fetchDatabaseData = async () => {
      try {
        
        const response = await fetch("http://127.0.0.1:3001/api/databases"); // Fetch actual databases
        const data = await response.json();
        
        // Populate gauge data with the fetched database names
        const filledGaugeData = data.charts.map(db => ({
          database: db.database,
          responsiveness: db.responsiveness,
          // Assuming you want to show security and recovery as well
          security: db.security,
          recovery: db.recovery,
        }));

        setGaugeData(filledGaugeData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDatabaseData();
  }, []);

  const handleDatabaseClick = (db) => {
    navigate(`/technical_details/${db.database}`); // Navigate to recovery page
  };

  return (
    <Box m="20px">
      <Header title="TECHNICAL" subtitle="Technical view" />
      <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap="20px">
        {gaugeData.map((db, index) => (
          <Box
            key={index}
            onClick={() => handleDatabaseClick(db)} // Add click handler
            backgroundColor={colors.primary[400]}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="320px"
            style={{ cursor: "pointer" }} // Indicate clickable
          >
            <Typography variant="h6" color={colors.grey[100]}>
              {db.database}
            </Typography>
            <GaugeComponent
              value={db.responsiveness} // Use responsiveness for the gauge
              type="radial"
              labels={{
                tickLabels: {
                  type: "inner",
                  ticks: [
                    { value: 20 },
                    { value: 40 },
                    { value: 60 },
                    { value: 80 },
                    { value: 100 }
                  ]
                }
              }}
              arc={{
                colorArray: ['#5BE12C', '#EA4228'],
                subArcs: [{ limit: 10 }, { limit: 30 }, {}, {}, {}],
                padding: 0.02,
                width: 0.3
              }}
              pointer={{
                elastic: true,
                animationDelay: 0
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Technical;

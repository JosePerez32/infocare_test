import { Box, useTheme, Typography, Alert } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import GaugeComponent from "react-gauge-component";
import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";

const ManagementDetails = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { organization } = useLocation().state || {};
  const navigate = useNavigate();
  const [detailsData, setDetailsData] = useState(null);
  const { source } = useParams(); // Retrieve source from the URL parameters
  const [gaugeOrder, setGaugeOrder] = useState(["responsiveness", "security", "recovery"]);
  const [alertVisible, setAlertVisible] = useState(false);

  useEffect(() => {
    const fetchDetailsData = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve token from localStorage

        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/dashboards/${organization}/management/sources/${source}`, 
          {
            headers: {
              'Authorization': `Bearer ${token}`, // Add token to Authorization header
              'Content-Type': 'application/json',
            },
          }
        );
        
        const data = await response.json();
        setDetailsData(data);
      } catch (error) {
        console.error("Error fetching details data:", error);
      }
    };

    const savedOrder = localStorage.getItem(`gaugeOrder_${source}`);
    if (savedOrder) {
      setGaugeOrder(JSON.parse(savedOrder));
    }

    fetchDetailsData();
  }, [organization, source]);

  const handleBoxClick = (route) => {
    navigate(`/management/details/${source}/${route}`);
  };

  const handleDragStart = (index) => {
    return (event) => {
      event.dataTransfer.setData("text/plain", index);
    };
  };

  const handleDrop = (index) => {
    return (event) => {
      event.preventDefault();
      const fromIndex = event.dataTransfer.getData("text/plain");
      const newOrder = [...gaugeOrder];
      const [movedItem] = newOrder.splice(fromIndex, 1);
      newOrder.splice(index, 0, movedItem);
      setGaugeOrder(newOrder);
      localStorage.setItem(`gaugeOrder_${source}`, JSON.stringify(newOrder));
      setAlertVisible(true);
      setTimeout(() => setAlertVisible(false), 3000); // Hide alert after 3 seconds
    };
  };

  const handleDragOver = (event) => {
    event.preventDefault(); // Allow the drop
  };

  const GaugeBox = ({ title, value, route, index }) => (
    <Box
      draggable
      onDragStart={handleDragStart(index)}
      onDrop={handleDrop(index)}
      onDragOver={handleDragOver}
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

  if (!detailsData) return <Typography>Loading...</Typography>;

  return (
    <Box m="20px">
      <Header title={`Details for ${source}`} subtitle="Details" />
      {alertVisible && <Alert variant="outlined" severity="success">Gauge chart order changed and saved</Alert>}
      <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap="20px">
        {gaugeOrder.map((gauge, index) => (
          <GaugeBox
            key={gauge}
            title={gauge.charAt(0).toUpperCase() + gauge.slice(1)} // Capitalize the first letter
            value={detailsData[gauge]}
            route={gauge}
            index={index} // Pass index to GaugeBox
          />
        ))}
      </Box>
    </Box>
  );
};

export default ManagementDetails;

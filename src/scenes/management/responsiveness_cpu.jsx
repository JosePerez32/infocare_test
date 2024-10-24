import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import { useParams, useLocation } from "react-router-dom";

const Line = ({ databaseName }) => {
  const [data, setData] = useState([]);
  const { organization } = useLocation().state || {};
  const { source } = useParams(); // Retrieve source from the URL parameters


  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve token from localStorage

        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/dashboards/${organization}/metrics/${source}/cpu_user`, 
          {
            headers: {
              'Authorization': `Bearer ${token}`, // Add token to Authorization header
              'Content-Type': 'application/json',
            },
          }
        );        
        const result = await response.json();

        const transformedData = [
          {
            id: "CPU Responsiveness",
            data: result,
          },
          {
            id: "CPU System",
            data: result.cpu_system_data,
          },
          {
            id: "CPU Idle",
            data: result.cpu_responsiveness.cpu_idle_data,
          },
          {
            id: "Swap In",
            data: result.swap_in_data,
          },
          {
            id: "Swap Out",
            data: result.swap_out_data,
          },
        ];

        setData(transformedData);
      } catch (error) {
        console.error("Error fetching responsiveness data:", error);
      }
    };

    fetchData();
  }, [databaseName,organization, source]);

  return (
    <Box m="20px">
      <Header title="CPU Usage" />
      <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap="10px">
        {data.map((chartData, index) => (
          <Box key={index} height="40vh" width="40vw">
            <LineChart
              data={[chartData]} // Passing each chart's data as an array
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Line;

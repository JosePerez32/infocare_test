import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";

const Line = ({ databaseName }) => {
  const [data, setData] = useState([]);

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:3001/api/management/responsiveness/cpu_usage/${databaseName}`
        );
        const result = await response.json();

        const transformedData = [
          {
            id: "CPU Responsiveness",
            data: result.cpu_responsiveness.cpu_data,
          },
          {
            id: "CPU System",
            data: result.cpu_responsiveness.cpu_system_data,
          },
          {
            id: "CPU Idle",
            data: result.cpu_responsiveness.cpu_idle_data,
          },
          {
            id: "Swap In",
            data: result.cpu_responsiveness.swap_in_data,
          },
          {
            id: "Swap Out",
            data: result.cpu_responsiveness.swap_out_data,
          },
        ];

        setData(transformedData);
      } catch (error) {
        console.error("Error fetching responsiveness data:", error);
      }
    };

    fetchData();
  }, [databaseName]);

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

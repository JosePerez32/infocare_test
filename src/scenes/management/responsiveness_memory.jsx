import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import Header from "../../components/Header";
import BarChart from "../../components/BarChart";

const ResponsivenessMemory = ({ databaseName }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:3001/api/management/memory/${databaseName}`
        );
        const result = await response.json();

        const transformedData = [
          {
            id: "Forced Disk",
            data: result.memory.forced_disk_data,
          },
          {
            id: "Sort Swaps",
            data: result.memory.swap_data,
          },
          {
            id: "Unused",
            data: result.memory.unused_memory_data,
          },
        ];

        setData(transformedData);
      } catch (error) {
        console.error("Error fetching memory data:", error);
      }
    };

    fetchData();
  }, [databaseName]);

  return (
    <Box m="20px">
      <Header title="Memory Overview" />
      <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap="10px">
        {data.map((chartData, index) => (
          <Box key={index} height="40vh" width="100%">
            <BarChart
              data={[chartData]}
              yAxisLegend={chartData.id}
              xAxisLegend="Time"
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ResponsivenessMemory;
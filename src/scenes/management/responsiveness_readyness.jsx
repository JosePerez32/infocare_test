import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import Header from "../../components/Header";
import BarChart from "../../components/BarChart";

const ResponsivenessReadyness = ({ databaseName }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:3001/api/management/readyness/${databaseName}`
        );
        const result = await response.json();

        const transformedData = [
          {
            id: "Unavailable",
            data: result.readyness.unavailable_data,
          },
        ];

        setData(transformedData);
      } catch (error) {
        console.error("Error fetching unavailable data:", error);
      }
    };

    fetchData();
  }, [databaseName]);

  return (
    <Box m="20px">
      <Header title="Readyness Overview" />
      <Box display="grid" gridTemplateColumns="repeat(1, 1fr)" gap="10px">
        {data.map((chartData, index) => (
          <Box key={index} height="80vh" width="100%">
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

export default ResponsivenessReadyness;
import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import Header from "../../components/Header";
import BarChart from "../../components/BarChart";

const RecoveryBackups = ({ databaseName }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:3001/api/management/recovery/backups/${databaseName}`
        );
        const result = await response.json();

        const transformedData = [
          {
            id: "Age",
            data: result.backups.age_data,
          },
          {
            id: "Size ",
            data: result.backups.size_data,
          },
          
        ];

        setData(transformedData);
      } catch (error) {
        console.error("Error fetching backups data:", error);
      }
    };


    fetchData();
  }, [databaseName]);

  return (
    <Box m="20px">
      <Header title="Recovery Backups" />
      <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap="10px">
        {data.map((chartData, index) => (
          <Box key={index} height="40vh" width="100%">
            <BarChart
              data={[chartData]}             
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default RecoveryBackups;
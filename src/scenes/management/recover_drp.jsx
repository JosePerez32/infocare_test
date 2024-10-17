import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import Header from "../../components/Header";
import BarChart from "../../components/BarChart";

const RecoveryDrp = ({ databaseName }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:3001/api/management/recovery/drp/${databaseName}`
        );
        const result = await response.json();

        const transformedData = [
          {
            id: "Unsupported",
            data: result.drp.unsupported_data,
          },
          {
            id: "Last Drp",
            data: result.drp.last_drp_data,
          },
          {
            id: " Scripts",
            data: result.drp.scripts_data,
          },
        ];

        setData(transformedData);
      } catch (error) {
        console.error("Error fetching security data:", error);
      }
    };

    fetchData();
  }, [databaseName]);

  return (
    <Box m="20px">
      <Header title="Recovery Drp" />
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

export default RecoveryDrp;
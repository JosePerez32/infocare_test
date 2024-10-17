import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import Header from "../../components/Header";
import PieChart from "../../components/PieChart";

const ResponsivenessSpace = ({ databaseName }) => {
  const [data, setData] = useState([]);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:3001/api/management/responsiveness/space/${databaseName}`
        );
        const result = await response.json();
        console.log(result)
        const transformedData = [
          {
            id: "Public",
            label: "Public",
            value: 40,  // Accessing result.results
            color: "hsl(104, 70%, 50%)"
          },
          {
            id: "Superusers",
            label: "Superusers",
            value: 30,  // Correct key
            color: "hsl(291, 70%, 50%)"
          },
          {
            id: "SSL",
            label: "SSL",
            value: 10,  // Correct key
            color: "hsl(229, 70%, 50%)"
          },
          {
            id: "Encryption",
            label: "Encryption",
            value:20,  // Correct key
            color: "hsl(344, 70%, 50%)"
          }
        ];

        setData(transformedData);
      } catch (error) {
        console.error("Error fetching space data:", error);
      }
    };

    fetchData();
  }, [databaseName]);

  return (
    <Box m="20px">
      <Header title="Space Overview" />
      <Box height="75vh">
        <PieChart data={data} />
      </Box>
    </Box>
  );
};

export default ResponsivenessSpace;
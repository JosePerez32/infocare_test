import React, { useState, useEffect } from "react";
import { ResponsiveLine } from "@nivo/line";
import { Box, FormControl, Select, MenuItem, Alert, TextField } from "@mui/material";
import { useParams } from "react-router-dom";

const ResponsiveCpu = ({ databaseName }) => {
  const [chartData, setChartData] = useState([]);
  const [duration, setDuration] = useState(60);
  const [startTime, setStartTime] = useState(() => {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const offsetHours = Math.floor(Math.abs(offset) / 60);
    const offsetMinutes = Math.abs(offset) % 60;
    const offsetStr = offset <= 0 ? 
      `+${offsetHours.toString().padStart(2, '0')}:${offsetMinutes.toString().padStart(2, '0')}` :
      `-${offsetHours.toString().padStart(2, '0')}:${offsetMinutes.toString().padStart(2, '0')}`;
    
    return now.toISOString().slice(0, 19) + offsetStr;
  });
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [error, setError] = useState(null);
  const organization = localStorage.getItem("organization");
  const { source } = useParams();

  const formatToAPIDateTime = (dateString) => {
    const date = new Date(dateString);
    const offset = date.getTimezoneOffset();
    const offsetHours = Math.floor(Math.abs(offset) / 60);
    const offsetMinutes = Math.abs(offset) % 60;
    const offsetStr = offset <= 0 ? 
      `+${offsetHours.toString().padStart(2, '0')}:${offsetMinutes.toString().padStart(2, '0')}` :
      `-${offsetHours.toString().padStart(2, '0')}:${offsetMinutes.toString().padStart(2, '0')}`;
    
    return `${date.getFullYear()}-${
      (date.getMonth() + 1).toString().padStart(2, '0')}-${
      date.getDate().toString().padStart(2, '0')}T${
      date.getHours().toString().padStart(2, '0')}:${
      date.getMinutes().toString().padStart(2, '0')}:${
      date.getSeconds().toString().padStart(2, '0')}${offsetStr}`;
  };

  const convertToHTMLDateTime = (apiDateTime) => {
    return apiDateTime.slice(0, 19);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        const token = localStorage.getItem('accessToken');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const formattedStartTime = formatToAPIDateTime(startTime);
        
        const url = `${process.env.REACT_APP_API_URL}/dashboards/${organization}/metrics/${source}/cpu_user?start_time=${encodeURIComponent(formattedStartTime)}&duration=${duration}`;
        
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'accept': 'application/json',
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const result = await response.json();
        
        if (!result || typeof result !== 'object') {
          throw new Error('Invalid response format');
        }

        const transformedData = [
          {
            id: "CPU Usage",
            data: result.x.map((timestamp, index) => ({
              x: convertToHTMLDateTime(timestamp),
              y: (result.y[index] / 100000) * playbackSpeed
            }))
          }
        ];
        
        if (transformedData[0].data.length === 0) {
          setError('No data available for the selected time range');
        } else {
          setChartData(transformedData);
        }
      } catch (error) {
        console.error("Detailed error:", error);
        setError(error.message || 'Failed to fetch data');
        setChartData([]);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 60000);
    
    return () => clearInterval(intervalId);
  }, [organization, source, duration, startTime, playbackSpeed]);

  return (
    <Box m="20px">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap="16px"
      >
        <Box flex="1">
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>CPU Usage</h2>
          <p style={{ color: '#666' }}>System CPU Usage Over Time</p>
        </Box>

        <Box display="flex" gap="16px" alignItems="center">
          <FormControl>
            <TextField
              type="datetime-local"
              value={convertToHTMLDateTime(startTime)}
              onChange={(e) => setStartTime(e.target.value + 'Z')}
              size="small"
              sx={{ bgcolor: 'white' }}
            />
          </FormControl>

          <FormControl>
            <Select
              value={duration.toString()}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              size="small"
              sx={{ bgcolor: 'white', minWidth: 120 }}
            >
              <MenuItem value="15">Last 15 minutes</MenuItem>
              <MenuItem value="30">Last 30 minutes</MenuItem>
              <MenuItem value="60">Last 1 hour</MenuItem>
              <MenuItem value="180">Last 3 hours</MenuItem>
              <MenuItem value="360">Last 6 hours</MenuItem>
              <MenuItem value="720">Last 12 hours</MenuItem>
              <MenuItem value="1440">Last 24 hours</MenuItem>
            </Select>
          </FormControl>

          <FormControl>
            <Select
              value={playbackSpeed.toString()}
              onChange={(e) => setPlaybackSpeed(parseInt(e.target.value))}
              size="small"
              sx={{ bgcolor: 'white', minWidth: 120 }}
            >
              <MenuItem value="1">1x</MenuItem>
              <MenuItem value="2">2x</MenuItem>
              <MenuItem value="5">5x</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      
      <Box height="70vh" width="100%" mt={2}>
        {chartData.length > 0 ? (
          <ResponsiveLine
            data={chartData}
            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            xScale={{ type: 'point' }}
            yScale={{
              type: 'linear',
              min: 'auto',
              max: 'auto',
              stacked: false,
              reverse: false
            }}
            yFormat=" >-.2f"
            curve="catmullRom"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Time',
              legendOffset: 36,
              legendPosition: 'middle',
              truncateTickAt: 0
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'CPU Usage',
              legendOffset: -40,
              legendPosition: 'middle',
              truncateTickAt: 0
            }}
            enableGridX={false}
            enableGridY={true}
            pointSize={10}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabelYOffset={-12}
            enableTouchCrosshair={true}
            useMesh={true}
            legends={[
              {
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 100,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: 'left-to-right',
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: 'circle',
                symbolBorderColor: 'rgba(0, 0, 0, .5)',
                effects: [
                  {
                    on: 'hover',
                    style: {
                      itemBackground: 'rgba(0, 0, 0, .03)',
                      itemOpacity: 1
                    }
                  }
                ]
              }
            ]}
          />
        ) : (
          !error && (
            <Box
              height="100%"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              Loading data...
            </Box>
          )
        )}
      </Box>
    </Box>
  );
};

export default ResponsiveCpu;
import React, { useState, useEffect } from "react";
import { Box, FormControl, Select, MenuItem, Alert, TextField } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useParams } from "react-router-dom";

const LineChartComponent = ({ databaseName }) => {
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
  const [error, setError] = useState(null);
  const organization = localStorage.getItem('organization');
  const { source } = useParams();

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { 
      hour: '2-digit',
      minute: '2-digit',
      hour12: false 
    });
  };

  const formatValue = (value) => {
    return value ? `${value.toFixed(2)}` : '0';
  };

  const transformData = (data) => {
    if (!data?.x || !data?.y) return [];
    
    // Get only the last 10 entries
    const lastIndex = data.x.length;
    const startIndex = Math.max(lastIndex - 10, 0);
    
    const x = data.x.slice(startIndex);
    const y = data.y.slice(startIndex);
    
    return x.map((timestamp, index) => {
      // Format y value by dividing by 100000000 to get number in format 62.50, 62.51, etc.
      const formattedValue = (y[index] / 100000000).toFixed(2);
      
      // Format timestamp to only show hours and minutes
      const date = new Date(timestamp);
      const timeStr = date.toLocaleTimeString([], { 
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      
      return {
        time: timeStr,
        value: parseFloat(formattedValue)
      };
    });
  };

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
        console.log('Formatted start time:', formattedStartTime);
        
        const url = `${process.env.REACT_APP_API_URL}/dashboards/${organization}/metrics/${source}/cpu_user?start_time=${encodeURIComponent(formattedStartTime)}&duration=${duration}`;
        console.log('Request URL:', url);
        
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
        console.log('API Response:', result);
        
        if (!result || typeof result !== 'object') {
          throw new Error('Invalid response format');
        }

        const transformedData = transformData(result);
        if (transformedData.length === 0) {
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
  }, [organization, source, duration, startTime]);

  const handleDurationChange = (event) => {
    setDuration(event.target.value);
  };

  const handleStartTimeChange = (event) => {
    const htmlDateTime = event.target.value;
    const date = new Date(htmlDateTime);
    const offset = date.getTimezoneOffset();
    const offsetHours = Math.floor(Math.abs(offset) / 60);
    const offsetMinutes = Math.abs(offset) % 60;
    const offsetStr = offset <= 0 ? 
      `+${offsetHours.toString().padStart(2, '0')}:${offsetMinutes.toString().padStart(2, '0')}` :
      `-${offsetHours.toString().padStart(2, '0')}:${offsetMinutes.toString().padStart(2, '0')}`;
    
    setStartTime(htmlDateTime + offsetStr);
  };

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap="16px">
        <Box flex="1">
          <h2 className="text-2xl font-bold">CPU Usage</h2>
          <p className="text-gray-600">Last 10 System CPU Usage Readings</p>
        </Box>
        
        <Box display="flex" gap="16px" alignItems="center">
          <FormControl>
            <TextField
              type="datetime-local"
              value={convertToHTMLDateTime(startTime)}
              onChange={handleStartTimeChange}
              size="small"
              className="bg-white"
            />
          </FormControl>

          <FormControl>
            <Select
              value={duration}
              onChange={handleDurationChange}
              size="small"
              className="bg-white min-w-[120px]"
            >
              <MenuItem value={15}>Last 15 minutes</MenuItem>
              <MenuItem value={30}>Last 30 minutes</MenuItem>
              <MenuItem value={60}>Last 1 hour</MenuItem>
              <MenuItem value={180}>Last 3 hours</MenuItem>
              <MenuItem value={360}>Last 6 hours</MenuItem>
              <MenuItem value={720}>Last 12 hours</MenuItem>
              <MenuItem value={1440}>Last 24 hours</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {error && (
        <Alert variant="destructive" className="mt-4">
          <p>{error}</p>
        </Alert>
      )}
      
      <Box className="h-[70vh] w-full mt-4">
        {chartData.length > 0 ? (
          <ResponsiveContainer>
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 50, bottom: 50 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-600" />
              <XAxis 
                dataKey="time" 
                angle={-45}
                textAnchor="end"
                height={70}
                tick={{ fill: '#666666' }}
                interval={0}
              />
              <YAxis 
                tickFormatter={formatValue}
                tick={{ fill: '#666666' }}
              />
              <Tooltip 
                formatter={(value) => [`${formatValue(value)}`, 'CPU Usage']}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid #cccccc',
                  borderRadius: '4px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#4caf50" 
                strokeWidth={2}
                dot={true}
                name="CPU Usage"
                animationDuration={300}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          !error && (
            <div className="h-full flex items-center justify-center">
              Loading data...
            </div>
          )
        )}
      </Box>
    </Box>
  );
};

export default LineChartComponent;
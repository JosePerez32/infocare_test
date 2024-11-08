import React, { useState, useEffect, useCallback } from 'react';
import { ResponsiveStream } from '@nivo/stream';
import { Box, FormControl, Select, MenuItem, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';

// Styled components to match dark theme
const DarkSelect = styled(Select)({
  backgroundColor: '#1E2130',
  color: '#fff',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#2a2b36',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#3a3b46',
  },
  '& .MuiSvgIcon-root': {
    color: '#fff',
  },
});

const DarkTextField = styled(TextField)({
  backgroundColor: '#1E2130',
  '& .MuiOutlinedInput-root': {
    color: '#fff',
    '& fieldset': {
      borderColor: '#2a2b36',
    },
    '&:hover fieldset': {
      borderColor: '#3a3b46',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#fff',
  },
});

const CpuUsageChart = () => {
  const [data, setData] = useState([]);
  const [playbackSpeed, setPlaybackSpeed] = useState('1');
  const [isPlaying, setIsPlaying] = useState(true);
  const [startTime, setStartTime] = useState(() => {
    const now = new Date();
    return now.toISOString().slice(0, 16);
  });

  // Generate a single data point
  const generateDataPoint = useCallback(() => {
    const now = new Date();
    const totalValue = 100;
    
    const user = 15 + Math.random() * 15;
    const idle = 10 + Math.random() * 20;
    const io = 20 + Math.random() * 25;
    const system = Math.max(0, totalValue - (user + idle + io));
    
    return {
      timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      User: user,
      Idle: idle,
      IO: io,
      System: system,
    };
  }, []);

  // Initialize data
  useEffect(() => {
    const initialData = Array.from({ length: 12 }, () => generateDataPoint());
    setData(initialData);
  }, []);

  // Update data periodically based on playback speed
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setData(prevData => {
        const newData = [...prevData.slice(1), generateDataPoint()];
        return newData;
      });
    }, 1000 / parseInt(playbackSpeed));

    return () => clearInterval(interval);
  }, [playbackSpeed, isPlaying, generateDataPoint]);

  return (
    <Box m="20px" sx={{ backgroundColor: '#1E2130', color: '#fff', borderRadius: '8px', p: 3 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap="16px"
      >
        <Box flex="1">
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>CPU Time Spend</h2>
          <p style={{ color: '#8b8c98', margin: '8px 0 0 0' }}>System CPU Usage Distribution</p>
        </Box>

        <Box display="flex" gap="16px" alignItems="center">
          <FormControl size="small">
            <DarkTextField
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              size="small"
            />
          </FormControl>

          <FormControl size="small">
            <DarkSelect
              value={playbackSpeed}
              onChange={(e) => setPlaybackSpeed(e.target.value)}
              size="small"
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="1">1x Speed</MenuItem>
              <MenuItem value="2">2x Speed</MenuItem>
              <MenuItem value="5">5x Speed</MenuItem>
            </DarkSelect>
          </FormControl>

          <Box
            component="button"
            onClick={() => setIsPlaying(!isPlaying)}
            sx={{
              backgroundColor: '#008FD5',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              padding: '8px 16px',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: '#0077B2',
              },
            }}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </Box>
        </Box>
      </Box>

      <Box height="600px" width="100%" mt={2}>
        <ResponsiveStream
          data={data}
          keys={['User', 'Idle', 'IO', 'System']}
          margin={{ top: 50, right: 130, bottom: 80, left: 60 }}
          axisBottom={{
            orient: 'bottom',
            tickSize: 5,
            tickPadding: 12,
            tickRotation: -45,
            format: (value) => value,
            legend: 'Time',
            legendOffset: 60,
            legendPosition: 'middle',
            tickColor: '#008FD5',
            textColor: '#ffffff',
          }}
          axisLeft={{
            orient: 'left',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            format: v => `${Math.round(v * 100)}%`,
            legend: 'Usage',
            legendOffset: -40,
            legendPosition: 'middle',
            tickColor: '#ffffff',
            textColor: '#ffffff',
          }}
          enableGridX={false}
          enableGridY={true}
          gridYValues={[0, 0.25, 0.5, 0.75, 1]}
          offsetType="expand"
          colors={['#008FD5', '#66B2FF', '#156082', '#A3C1D9']}
          fillOpacity={0.85}
          borderColor={{ theme: 'background' }}
          animate={true}
          motionConfig="gentle"
          theme={{
            background: '#1E2130',
            textColor: '#ffffff',
            fontSize: 12,
            grid: {
              line: {
                stroke: '#2D3142',
                strokeWidth: 1
              }
            },
            axis: {
              ticks: {
                text: {
                  fill: '#ffffff'
                }
              },
              legend: {
                text: {
                  fill: '#ffffff',
                  fontSize: 14
                }
              }
            },
            tooltip: {
              container: {
                background: '#2D3142',
                color: '#ffffff',
                fontSize: '14px',
                borderRadius: '6px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
              }
            }
          }}
          legends={[
            {
              anchor: 'bottom-right',
              direction: 'column',
              translateX: 100,
              itemWidth: 80,
              itemHeight: 20,
              itemTextColor: '#ffffff',
              symbolSize: 12,
              symbolShape: 'circle',
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemTextColor: '#ffffff',
                    itemBackground: 'rgba(255, 255, 255, 0.1)'
                  }
                }
              ]
            }
          ]}
        />
      </Box>
    </Box>
  );
};

export default CpuUsageChart;
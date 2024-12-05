import React, { useState, useEffect } from 'react';
import { ResponsiveLine } from '@nivo/line';
import { Box, FormControl, Select, MenuItem, TextField } from '@mui/material';
import { useTheme } from '@mui/material';
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { tokens } from '../../theme';
import Header from '../../components/Header';

const SwapPagesChart = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const { organization } = useLocation().state || {};
  const { source } = useParams();
  const [data, setData] = useState([
    {
      id: 'Swap Pages In',
      color: '#008FD5',
      data: []
    },
    {
      id: 'Swap Pages Out',
      color: '#71D8BD',
      data: []
    }
  ]);
  const [rows] = useState(20);
  const [grouping, setGrouping] = useState('sec');
  const [startTime, setStartTime] = useState(() => {
    const now = new Date();
    return now.toISOString().slice(0, 19);
  });

  useEffect(() => {
    const fetchSwapPagesData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
  
        const dateObj = new Date(startTime);
        const timezoneOffset = dateObj.getTimezoneOffset();
        const offsetSign = timezoneOffset > 0 ? '-' : '+';
        const offsetHours = String(Math.floor(Math.abs(timezoneOffset) / 60)).padStart(2, '0');
        const offsetMinutes = String(Math.abs(timezoneOffset) % 60).padStart(2, '0');
  
        const formattedDateTime = dateObj.toISOString().slice(0, -1) + offsetSign + offsetHours + ':' + offsetMinutes;
  
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/dashboards/${organization}/metrics/${source}/swap_usage?start_time=${encodeURIComponent(
            formattedDateTime
          )}&rows=${rows}&grouping=${grouping}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
  
        const rawData = await response.json();
  
        if (!rawData || !rawData.time || !rawData.swap_pages_in || !rawData.swap_pages_out) {
          console.error('Invalid data format received:', rawData);
          return;
        }
  
        const transformedData = [
          {
            id: 'Swap Pages In',
            color: '#008FD5',
            data: rawData.time.map((time, index) => ({
              x: new Date(time).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit', 
                hour12: false 
              }),
              y: parseFloat(rawData.swap_pages_in[index] || 0),
            }))
          },
          {
            id: 'Swap Pages Out',
            color: '#71D8BD',
            data: rawData.time.map((time, index) => ({
              x: new Date(time).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit', 
                hour12: false 
              }),
              y: parseFloat(rawData.swap_pages_out[index] || 0),
            }))
          }
        ];
  
        setData(transformedData);
      } catch (error) {
        console.error('Error fetching Swap Pages data:', error);
      }
    };
  
    fetchSwapPagesData();
    const interval = setInterval(fetchSwapPagesData, 5000);
  
    return () => clearInterval(interval);
  }, [organization, source, startTime, rows, grouping]);

  return (
    <Box m="20px">
      <Header title="Swap Pages" subtitle="System Swap Pages Distribution" />
      
      <Box 
        backgroundColor={colors.primary[400]}
        p="20px"
        width={"650px"}
        borderRadius="8px"
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <FormControl size="small" sx={{ minWidth: 250 }}>
            <TextField
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              size="small"
              sx={{
                backgroundColor: colors.primary[400],
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: colors.grey[100],
                  },
                  '&:hover fieldset': {
                    borderColor: colors.grey[100],
                  },
                },
                '& .MuiInputBase-input': {
                  color: colors.grey[100],
                },
              }}
            />
          </FormControl>

          <Box display="flex" gap="16px">
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                value={grouping}
                onChange={(e) => setGrouping(e.target.value)}
                sx={{
                  backgroundColor: colors.primary[400],
                  color: colors.grey[100],
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: colors.grey[100],
                  },
                }}
              >
                <MenuItem value="sec">Seconds</MenuItem>
                <MenuItem value="min">Minutes</MenuItem>
                <MenuItem value="hour">Hours</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        <Box height="340px">
          {data[0].data.length > 0 && (
            <ResponsiveLine
              data={data}
              margin={{ top: 20, right: 80, bottom: 40, left: 50 }}
              xScale={{ type: 'point' }}
              yScale={{ 
                type: 'linear',
                min: 0,
                max: 'auto',
                stacked: false,
              }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                orient: 'bottom',
                tickSize: 5,
                tickPadding: 5,
                tickRotation: -45,
                legendOffset: 40,
                legendPosition: 'middle',
              }}
              axisLeft={{
                orient: 'left',
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legendOffset: -40,
                legendPosition: 'middle',
              }}
              colors={{ datum: 'color' }}
              pointSize={4}
              pointColor={{ theme: 'background' }}
              pointBorderWidth={2}
              pointBorderColor={{ from: 'serieColor' }}
              pointLabelYOffset={-12}
              useMesh={true}
              enableArea={true}
              enableGridX={false}
              theme={{
                background: colors.primary[400],
                textColor: colors.grey[100],
                fontSize: 11,
                axis: {
                  domain: {
                    line: {
                      stroke: colors.grey[100],
                    },
                  },
                  ticks: {
                    line: {
                      stroke: colors.grey[100],
                      strokeWidth: 1,
                    },
                    text: {
                      fill: colors.grey[100],
                    },
                  },
                },
                grid: {
                  line: {
                    stroke: colors.grey[500],
                    strokeWidth: 1,
                  },
                },
                legends: {
                  text: {
                    fill: colors.grey[100],
                  },
                },
                tooltip: {
                  container: {
                    background: colors.primary[400],
                    color: colors.grey[100],
                  },
                },
              }}
              legends={[
                {
                  anchor: 'bottom-right',
                  direction: 'column',
                  justify: false,
                  translateX: 90, 
                  translateY: 0,
                  itemsSpacing: 0,
                  itemDirection: 'left-to-right',
                  itemWidth: 80,
                  itemHeight: 20,
                  itemOpacity: 0.75,
                  symbolSize: 12,
                  symbolShape: 'circle',
                }
              ]}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default SwapPagesChart;
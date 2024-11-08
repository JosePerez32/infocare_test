import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import Header from "../../components/Header";

import { ResponsiveLine } from '@nivo/line';

const ResponsivenessMemory = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Generate mock data
    const mockData = [
      {
        id: "BP1",
        data: [
          { x: 0, y: 115 },
          { x: 1, y: 110 },
          { x: 2, y: 118 },
          { x: 3, y: 114 },
          { x: 4, y: 119 },
          { x: 5, y: 112 },
        ],
      },
      {
        id: "BP2",
        data: [
          { x: 0, y: 95 },
          { x: 1, y: 92 },
          { x: 2, y: 100 },
          { x: 3, y: 97 },
          { x: 4, y: 101 },
          { x: 5, y: 98 },
        ],
      },
      {
        id: "BP3",
        data: [
          { x: 0, y: 110 },
          { x: 1, y: 115 },
          { x: 2, y: 112 },
          { x: 3, y: 110 },
          { x: 4, y: 118 },
          { x: 5, y: 115 },
        ],
      },
      {
        id: "BP4",
        data: [
          { x: 0, y: 120 },
          { x: 1, y: 118 },
          { x: 2, y: 115 },
          { x: 3, y: 120 },
          { x: 4, y: 112 },
          { x: 5, y: 115 },
        ],
      },
    ];

    setData(mockData);
  }, []);

  return (
    <Box sx={{ 
      m: "20px",
      backgroundColor: '#1E2130',
      borderRadius: '8px',
      p: 3,
      color: '#fff'
    }}>
      <Box>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2
        }}>
          <Box>
            <Header title="Bufferpool Hit Ratio" sx={{ color: '#fff' }} />
            <p style={{ color: '#8b8c98', margin: '8px 0 0 0' }}>Memory Performance Metrics</p>
          </Box>
        </Box>
      </Box>

      <Box height="60vh" width="100%">
        <ResponsiveLine
          data={data}
          margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
          xScale={{ type: 'point' }}
          yScale={{
            type: 'linear',
            min: 'auto',
            max: 'auto',
            stacked: true,
            reverse: false,
          }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            orient: 'bottom',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Time',
            legendOffset: 36,
            legendPosition: 'middle',
            tickColor: '#008FD5',
            textColor: '#ffffff'
          }}
          axisLeft={{
            orient: 'left',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Bufferpool Hit Ratio',
            legendOffset: -40,
            legendPosition: 'middle',
            tickColor: '#ffffff',
            textColor: '#ffffff'
          }}
          pointSize={10}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          useMesh={true}
          colors={['#008FD5', '#66B2FF', '#156082', '#A3C1D9']}
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
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
              }
            }
          }}
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
              itemTextColor: '#ffffff',
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemBackground: 'rgba(255, 255, 255, 0.1)',
                    itemOpacity: 1
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

export default ResponsivenessMemory;
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Stack,
  Fade,
  LinearProgress
} from '@mui/material';
import {
  Search,
  FilterList,
  Info,
  Warning,
  Error,
  CheckCircle
} from '@mui/icons-material';
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";

const Logging = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalLogs, setTotalLogs] = useState(0);

  // Mock data - Replace with your actual API call
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch('/api/logs');
        const data = await response.json();
        setLogs(data);
        setTotalLogs(data.length);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching logs:', error);
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'error':
        return colors.redAccent[500];
      case 'warning':
        return colors.orangeAccent[500];
      case 'info':
        return colors.blueAccent[500];
      case 'success':
        return colors.greenAccent[500];
      default:
        return colors.grey[500];
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity.toLowerCase()) {
      case 'error':
        return <Error />;
      case 'warning':
        return <Warning />;
      case 'info':
        return <Info />;
      case 'success':
        return <CheckCircle />;
      default:
        return <Info />;
    }
  };

  const filteredLogs = logs.filter(log =>
    Object.values(log).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography
          variant="h2"
          color={colors.grey[100]}
          fontWeight="bold"
          sx={{ mb: "5px" }}
        >
          System Logs
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Box
        mt="20px"
        mb="40px"
        display="grid"
        gridTemplateColumns="repeat(auto-fit, minmax(240px, 1fr))"
        gap="20px"
      >
        {['Error', 'Warning', 'Info', 'Success'].map((type) => (
          <Card
            key={type}
            sx={{
              backgroundColor: colors.primary[400],
              ':hover': { backgroundColor: colors.primary[300] },
              transition: 'background-color 0.3s'
            }}
          >
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    backgroundColor: getSeverityColor(type),
                    borderRadius: '50%',
                    p: 1,
                    display: 'flex'
                  }}
                >
                  {getSeverityIcon(type)}
                </Box>
                <Box>
                  <Typography variant="h4" color={colors.grey[100]}>
                    {logs.filter(log => log.severity === type.toLowerCase()).length}
                  </Typography>
                  <Typography variant="body2" color={colors.grey[300]}>
                    {type} Logs
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Search and Filter Bar */}
      <Box mb="20px" display="flex" justifyContent="space-between" alignItems="center">
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search logs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            backgroundColor: colors.primary[400],
            borderRadius: '4px',
            width: '300px',
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: colors.grey[500],
              },
              '&:hover fieldset': {
                borderColor: colors.grey[300],
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: colors.grey[300] }} />
              </InputAdornment>
            ),
          }}
        />
        <IconButton
          sx={{
            backgroundColor: colors.primary[400],
            '&:hover': { backgroundColor: colors.primary[300] },
          }}
        >
          <FilterList />
        </IconButton>
      </Box>

      {/* Logs Table */}
      <Paper
        sx={{
          backgroundColor: colors.primary[400],
          borderRadius: '8px',
          overflow: 'hidden'
        }}
      >
        {loading ? (
          <Box sx={{ width: '100%', p: 2 }}>
            <LinearProgress />
          </Box>
        ) : (
          <Fade in={!loading}>
            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: colors.grey[100], fontWeight: 'bold' }}>Timestamp</TableCell>
                    <TableCell sx={{ color: colors.grey[100], fontWeight: 'bold' }}>Severity</TableCell>
                    <TableCell sx={{ color: colors.grey[100], fontWeight: 'bold' }}>Source</TableCell>
                    <TableCell sx={{ color: colors.grey[100], fontWeight: 'bold' }}>Message</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredLogs
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((log, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          '&:hover': { backgroundColor: colors.primary[300] },
                          transition: 'background-color 0.3s'
                        }}
                      >
                        <TableCell sx={{ color: colors.grey[100] }}>
                          {new Date(log.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getSeverityIcon(log.severity)}
                            label={log.severity}
                            sx={{
                              backgroundColor: getSeverityColor(log.severity),
                              color: '#fff',
                              '& .MuiChip-icon': {
                                color: '#fff'
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ color: colors.grey[100] }}>{log.source}</TableCell>
                        <TableCell sx={{ color: colors.grey[100] }}>{log.message}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Fade>
        )}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalLogs}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            color: colors.grey[100],
            borderTop: `1px solid ${colors.grey[800]}`,
            '& .MuiTablePagination-selectIcon': {
              color: colors.grey[100]
            }
          }}
        />
      </Paper>
    </Box>
  );
};

export default Logging;
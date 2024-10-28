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
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Stack,
  Fade,
  LinearProgress,
  useTheme,
  alpha,
  Avatar,
  Tooltip
} from '@mui/material';
import {
  Search,
  MouseOutlined,
  Visibility
} from '@mui/icons-material';

const UserActivityLogging = () => {
  const theme = useTheme();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalLogs, setTotalLogs] = useState(0);

  // Move actionTypes outside of component or use useMemo
  const actionTypes = {
    CLICK: 'click',
    VIEW: 'view'
  };

  // Custom colors for actions
  const actionColors = {
    [actionTypes.CLICK]: '#71D8BD',  // Custom green color for clicks
    [actionTypes.VIEW]: '#2F8ECD'    // Custom blue color for views
  };

  // Get icon for action types
  const getActionIcon = (action) => {
    const icons = {
      [actionTypes.CLICK]: <MouseOutlined />,
      [actionTypes.VIEW]: <Visibility />
    };
    return icons[action];
  };

  // Mock data generation with simplified user activity
  useEffect(() => {
    const generateMockUserActivity = (CLICK_TYPE, VIEW_TYPE) => {
      const users = [
        { name: 'John Smith', email: 'john.smith@example.com', role: 'User' },
        { name: 'Sarah Johnson', email: 'sarah.j@example.com', role: 'Admin' },
        { name: 'Mike Wilson', email: 'mike.w@example.com', role: 'User' }
      ];

      const viewActions = [
        'Viewed Dashboard',
        'Viewed Profile',
        'Viewed Settings',
        'Viewed Reports',
        'Viewed Analytics'
      ];

      const clickActions = [
        'Clicked Submit Button',
        'Clicked Menu Item',
        'Clicked Download',
        'Clicked Save',
        'Clicked Navigation Link'
      ];

      return Array.from({ length: 50 }, (_, index) => {
        const user = users[Math.floor(Math.random() * users.length)];
        const isClick = Math.random() > 0.5;
        const action = isClick ? CLICK_TYPE : VIEW_TYPE;
        const actionDetail = isClick 
          ? clickActions[Math.floor(Math.random() * clickActions.length)]
          : viewActions[Math.floor(Math.random() * viewActions.length)];
        
        return {
          id: `LOG${String(index + 1).padStart(4, '0')}`,
          timestamp: new Date(Date.now() - index * 3600000).toISOString(),
          user: {
            ...user,
            initials: user.name.split(' ').map(n => n[0]).join('')
          },
          action: action,
          element: actionDetail,
          path: `/dashboard/${action.toLowerCase()}/${index}`,
          url: `https://example.com/dashboard/${action.toLowerCase()}/${index}`,
        };
      });
    };

    const mockData = generateMockUserActivity(actionTypes.CLICK, actionTypes.VIEW);
    setLogs(mockData);
    setTotalLogs(mockData.length);
    setLoading(false);
  }, [actionTypes.CLICK, actionTypes.VIEW]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getActionColor = (action) => {
    return actionColors[action];
  };

  const filteredLogs = logs.filter(log =>
    Object.values(log).some(value =>
      typeof value === 'string' 
        ? value.toLowerCase().includes(searchTerm.toLowerCase())
        : typeof value === 'object' && value !== null
          ? Object.values(value).some(v => 
              typeof v === 'string' && v.toLowerCase().includes(searchTerm.toLowerCase())
            )
          : false
    )
  );

  return (
    <Box sx={{ p: 3, bgcolor: alpha(theme.palette.background.default, 0.98) }}>
      {/* Header */}
      <Typography
        variant="h4"
        sx={{
          mb: 3,
          fontWeight: 'bold',
          color: theme.palette.text.primary
        }}
      >
        User Activity Logs
      </Typography>

      {/* Stats Cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 3,
          mb: 4
        }}
      >
        {Object.entries(actionTypes).map(([key, type]) => (
          <Card
            key={type}
            elevation={2}
            sx={{
              bgcolor: alpha(theme.palette.background.paper, 0.9),
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: theme.shadows[8]
              }
            }}
          >
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    bgcolor: alpha(getActionColor(type), 0.1),
                    borderRadius: '50%',
                    p: 1,
                    display: 'flex',
                    color: getActionColor(type)
                  }}
                >
                  {getActionIcon(type)}
                </Box>
                <Box>
                  <Typography variant="h5" color="text.primary">
                    {logs.filter(log => log.action === type).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                    {type} Actions
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Search Bar */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search logs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            flexGrow: 1,
            maxWidth: 300,
            bgcolor: theme.palette.background.paper,
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Logs Table */}
      <Paper elevation={3} sx={{ bgcolor: theme.palette.background.paper }}>
        {loading ? (
          <Box sx={{ width: '100%', p: 2 }}>
            <LinearProgress />
          </Box>
        ) : (
          <Fade in={!loading}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Time</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>User</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Element</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Path</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredLogs
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((log) => (
                      <TableRow
                        key={log.id}
                        sx={{
                          '&:hover': { bgcolor: alpha(theme.palette.action.hover, 0.1) },
                          transition: 'background-color 0.2s'
                        }}
                      >
                        <TableCell>
                          {new Date(log.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Tooltip title={`${log.user.role}`}>
                              <Avatar
                                sx={{
                                  width: 30,
                                  height: 30,
                                  bgcolor: getActionColor(log.action),
                                  fontSize: '0.875rem'
                                }}
                              >
                                {log.user.initials}
                              </Avatar>
                            </Tooltip>
                            <Box>
                              <Typography variant="body2">{log.user.name}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {log.user.email}
                              </Typography>
                            </Box>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getActionIcon(log.action)}
                            label={log.action}
                            size="small"
                            sx={{
                              bgcolor: alpha(getActionColor(log.action), 0.1),
                              color: getActionColor(log.action),
                              textTransform: 'capitalize',
                              '& .MuiChip-icon': {
                                color: 'inherit'
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell>{log.element}</TableCell>
                        <TableCell>
                          <Tooltip title={log.url}>
                            <Typography variant="body2" sx={{ 
                              maxWidth: 200,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {log.path}
                            </Typography>
                          </Tooltip>
                        </TableCell>
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
        />
      </Paper>
    </Box>
  );
};

export default UserActivityLogging;
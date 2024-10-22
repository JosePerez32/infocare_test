import React, { useContext } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  useTheme,
  Tooltip,
  Chip,
  Breadcrumbs
} from "@mui/material";
import { ColorModeContext } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import { tokens } from "../../theme";
import Link from '@mui/material/Link';

const Topbar = ({ userName, setIsSidebar, onLogout }) => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const colors = tokens(theme.palette.mode);
  const location = useLocation();
  const userRole = localStorage.getItem('userRole');


  const breadcrumbNameMap = {
    '/': 'Home',
    '/dashboard': 'Dashboard',
    '/management': 'Management',
    '/technical': 'Technical',
    '/invoices': 'Invoices',
    '/form': 'Form',
    '/faq': 'FAQ',
    '/calendar': 'Calendar',
    '/responsiveness': 'Responsiveness',
    '/cpu': 'CPU',
    '/memory': 'Memory',
    '/space': 'Space',
    '/speed': 'Speed',
    '/readiness': 'Readiness',
    '/security': 'Security',
    '/recovery': 'Recovery',
  };

  const pathnames = location.pathname.split('/').filter((x) => x);

  const getBreadcrumbName = (pathname, part, index, parts) => {
    if (part.startsWith('details/')) {
      return `Details of ${part.split('/')[1]}`;
    }
    if (breadcrumbNameMap[part]) {
      return breadcrumbNameMap[part];
    }
    return part.charAt(0).toUpperCase() + part.slice(1);
  };

  const getLinkTo = (index, parts) => {
    const path = parts.slice(0, index + 1);
    if (path.some(part => part.startsWith('details/'))) {
      const detailsIndex = path.findIndex(part => part.startsWith('details/'));
      path[detailsIndex] = path[detailsIndex].replace('details/', 'details/');
    }
    return `/${path.join('/')}`;
  };

  const getCombinedBreadcrumbs = () => {
    let combinedPathnames = [];
    for (let i = 0; i < pathnames.length; i++) {
      if (pathnames[i] === 'details' && i + 1 < pathnames.length) {
        combinedPathnames.push(`details/${pathnames[i + 1]}`);
        i++; // Skip the next item as we've combined it
      } else {
        combinedPathnames.push(pathnames[i]);
      }
    }
    return combinedPathnames;
  };

  const combinedPathnames = getCombinedBreadcrumbs();

  const handleLogout = () => {
    onLogout();
  };

  const getRoleChip = () => {
    const isAdmin = userRole.toLowerCase().includes('infocare-admin');
    return (
      <Chip
        icon={isAdmin ? <AdminPanelSettingsIcon /> : <PersonIcon />}
        label={isAdmin ? 'Admin' : 'Normal User'}
        color={isAdmin ? 'secondary' : 'primary'}
        sx={{ ml: 2 }}
      />
    );
  };

  return (
    <AppBar 
      position="static" 
      color="default" 
      elevation={20}
      sx={{
        background: `${colors.primary[400]} !important`,
        color: theme.palette.text.primary,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Breadcrumbs aria-label="breadcrumb" sx={{ flexGrow: 1 }}>
            <Link component={RouterLink} underline="hover" color="inherit" to="/">
              {breadcrumbNameMap['/']}
            </Link>
            {combinedPathnames.map((value, index) => {
              const last = index === combinedPathnames.length - 1;
              const to = getLinkTo(index, combinedPathnames);

              return last ? (
                <Typography color="text.primary" key={to}>
                  {getBreadcrumbName(location.pathname, value, index, combinedPathnames)}
                </Typography>
              ) : (
                <Link
                  component={RouterLink}
                  underline="hover"
                  color="inherit"
                  to={to}
                  key={to}
                >
                  {getBreadcrumbName(location.pathname, value, index, combinedPathnames)}
                </Link>
              );
            })}
          </Breadcrumbs>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title="Toggle color mode">
            <IconButton onClick={colorMode.toggleColorMode} color="inherit">
              {theme.palette.mode === "dark" ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Settings">
            <IconButton color="inherit">
              <SettingsOutlinedIcon />
            </IconButton>
          </Tooltip>
          
          {userRole && getRoleChip()}

          {userName && (
            <Chip
              avatar={<Avatar sx={{ bgcolor: theme.palette.primary.main }}>{userName.charAt(0).toUpperCase()}</Avatar>}
              label={userName}
              variant="outlined"
              sx={{
                ml: 2,
                borderColor: 'transparent',
                '& .MuiChip-label': {
                  color: theme.palette.text.primary,
                },
              }}
            />
          )}
          
          <Tooltip title="Logout">
            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
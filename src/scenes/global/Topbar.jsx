import React from 'react';
import { Box, IconButton, useTheme } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { useLocation, Link as RouterLink } from 'react-router-dom';

const Topbar = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const location = useLocation();

  const pathnames = location.pathname.split('/').filter((x) => x);

  const breadcrumbNameMap = {
    '/': 'Home',
    'dashboard': 'Dashboard',
    'management': 'Management',
    'technical': 'Technical',
    'invoices': 'Invoices',
    'form': 'Form',
    'faq': 'FAQ',
    'calendar': 'Calendar',
    'responsiveness': 'Responsiveness',
    'cpu': 'CPU',
    'memory': 'Memory',
    'space': 'Space',
    'speed': 'Speed',
    'readiness': 'Readiness',
    'security': 'Security',
    'recovery': 'Recovery',
  };

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

  return (
    <Box display="flex" justifyContent="space-between" p={4} >
      {/* BREADCRUMBS */}
      <Breadcrumbs aria-label="breadcrumb">
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

      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>       
        <IconButton>
          <SettingsOutlinedIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Topbar;
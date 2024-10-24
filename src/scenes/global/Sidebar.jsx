import { useState } from "react";
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme, Divider } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import Chip from '@mui/material/Chip';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import SchemaIcon from '@mui/icons-material/Schema';
import BookIcon from '@mui/icons-material/Book';
import GroupIcon from '@mui/icons-material/Group';
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const userRole = localStorage.getItem('userRole');

  // Function to check if user has access to a route
  const hasAccess = (allowedRoles) => {
    return allowedRoles.includes(userRole);
  };

  const getMenuItems = () => {
    const commonItems = (
      <>
        <Item
          title="Home"
          to="/"
          icon={<HomeOutlinedIcon />}
          selected={selected}
          setSelected={setSelected}
        />
        <Typography
          variant="h6"
          color={colors.grey[300]}
          sx={{ m: "15px 0 5px 20px" }}
        >
          Dashboard
        </Typography>
      </>
    );

    // Only render admin items if user has admin role
    const adminItems = hasAccess(['writer', 'admin']) && (
      <>
        <Item
          title="Management View"
          to="/management"
          icon={<ManageAccountsIcon />}
          selected={selected}
          setSelected={setSelected}
        />
        <Item
          title="Technical View"
          to="/technical"
          icon={<ContactsOutlinedIcon />}
          selected={selected}
          setSelected={setSelected}
        />
        <Divider style={{ margin: "15px 0", backgroundColor: colors.grey[500] }} />
        <Typography
          variant="h6"
          color={colors.grey[300]}
          sx={{ m: "15px 0 5px 20px" }}
        >
          Application
        </Typography>
        <SubMenu
          title="Users"
          icon={<PeopleOutlinedIcon />}
        >
          <Item
            title="Create User"
            to="/form"
            icon={<GroupAddIcon />}
            selected={selected}
            setSelected={setSelected}
          />
          <Item
            title="Users List"
            to="/users"
            icon={<GroupIcon />}
            selected={selected}
            setSelected={setSelected}
          />
        </SubMenu>
         <Item
          title="Maps"
          to="/map"
          icon={<SchemaIcon />}
          selected={selected}
          setSelected={setSelected}
        />
      </>
    );

    // Only render client items if user has client role
    const clientItems = hasAccess(['reader']) && (
    <>
      <Item
          title="Technical View"
          to="/technical"
          icon={<ContactsOutlinedIcon />}
          selected={selected}
          setSelected={setSelected}
        />
      <Item
        title="Management View"
        to="/management"
        icon={<ManageAccountsIcon />}
        selected={selected}
        setSelected={setSelected}
      />
    </>
    );

    // Only render in-house items if user has in-house role
    const inHouseItems = hasAccess(['admin']) && (
    <>
      <Item
          title="Logging"
          to="/logging"
          icon={<BookIcon />}
          selected={selected}
          setSelected={setSelected}
      />
      <Item
          title="Clients "
          to="/clients"
          icon={<RecentActorsIcon />}
          selected={selected}
          setSelected={setSelected}
        />
    </>
    );

    return (
      <>
        {commonItems}
        {adminItems}
        {clientItems}
        {inHouseItems}
        <Item
          title="FAQ Page"
          to="/faq"
          icon={<HelpOutlineOutlinedIcon />}
          selected={selected}
          setSelected={setSelected}
        />
      </>
    );
  };

    

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#71D8BD !important",
        },
        "& .pro-menu-item.active": {
          color: "#71D8BD !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <img src="./assets/Watermark_Project_rechts_24pxPNG.png" alt="Infocare Logo" style={{ width: "24px" }} />
                  <Typography variant="h3" color={colors.grey[100]}>
                    Infocare
                  </Typography>
                </Box>
                <Box position="relative" top="-6px" ml="-4px">
                  <Chip label="v1.3" size="small" style={{ backgroundColor: '#71D8BD', color: colors.primary[400] }} />
                </Box>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)} >
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            {getMenuItems()}
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
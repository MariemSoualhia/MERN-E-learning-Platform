import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Menu,
  MenuItem,
  Avatar,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import {
  FaTachometerAlt,
  FaUser,
  FaFileAlt,
  FaTasks,
  FaSignOutAlt,
} from "react-icons/fa";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { styled, useTheme } from "@mui/material/styles";

import "./Sidebar.css"; // Import CSS for additional styles

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const Sidebar = ({ role }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("currentuser"))
  );

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleProfileClick = () => {
    setAnchorEl((prev) => !prev);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Ajouter la logique de déconnexion ici
    handleClose();
    localStorage.removeItem("token");
    localStorage.removeItem("currentuser");
    localStorage.removeItem("selectedCameraList");
    console.log("Déconnexion...");
    navigate("/");
  };

  return (
    <Drawer
      variant="permanent"
      open={open}
      onMouseEnter={handleDrawerOpen}
      onMouseLeave={handleDrawerClose}
      sx={{
        width: open ? drawerWidth : `calc(${theme.spacing(7)} + 1px)`,
        flexShrink: 0,
        whiteSpace: "nowrap",
        boxSizing: "border-box",
        "& .MuiDrawer-paper": open ? openedMixin(theme) : closedMixin(theme),
      }}
      PaperProps={{
        sx: {
          backgroundColor: theme.palette.primary.main, // Utilisation du bleu foncé du thème
          color: "white", // Forcer la couleur blanche
        },
      }}
    >
      <DrawerHeader>
        <IconButton
          onClick={open ? handleDrawerClose : handleDrawerOpen}
          sx={{ color: "white" }}
        >
          {open ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <Box sx={{ display: "flex", alignItems: "center", p: 1, color: "white" }}>
        <Avatar
          src={user.photoProfil}
          onClick={handleMenu}
          sx={{ cursor: "pointer", mr: 2 }}
        />
        {open && (
          <Box>
            <Typography variant="body2" sx={{ color: "white" }}>
              Signed in as
            </Typography>
            <Typography variant="body2" sx={{ color: "white" }}>
              {user.email}
            </Typography>
          </Box>
        )}
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose} component={Link} to="/profile">
            Profile
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <FaSignOutAlt style={{ marginRight: "8px" }} />
            Logout
          </MenuItem>
        </Menu>
      </Box>
      <Divider />
      <List>
        {role === "admin" && (
          <>
            <ListItem button component={Link} to="/admin">
              <ListItemIcon sx={{ color: "white" }}>
                <FaTachometerAlt />
              </ListItemIcon>
              {open && (
                <ListItemText
                  primary="Tableau de bord"
                  sx={{ color: "white" }}
                />
              )}
            </ListItem>
            <ListItem button component={Link} to="/admin/users">
              <ListItemIcon sx={{ color: "white" }}>
                <FaUser />
              </ListItemIcon>
              {open && (
                <ListItemText
                  primary="Gestion des utilisateurs"
                  sx={{ color: "white" }}
                />
              )}
            </ListItem>
            <ListItem button component={Link} to="/admin/courses">
              <ListItemIcon sx={{ color: "white" }}>
                <FaFileAlt />
              </ListItemIcon>
              {open && (
                <ListItemText
                  primary="Gestion des cours"
                  sx={{ color: "white" }}
                />
              )}
            </ListItem>
          </>
        )}
        {role === "formateur" && (
          <>
            <ListItem button component={Link} to="/formateur">
              <ListItemIcon sx={{ color: "white" }}>
                <FaTachometerAlt />
              </ListItemIcon>
              {open && (
                <ListItemText
                  primary="Tableau de bord"
                  sx={{ color: "white" }}
                />
              )}
            </ListItem>
            <ListItem button component={Link} to="/formateur/add-formation">
              <ListItemIcon sx={{ color: "white" }}>
                <FaFileAlt />
              </ListItemIcon>
              {open && (
                <ListItemText
                  primary="Ajouter une formation"
                  sx={{ color: "white" }}
                />
              )}
            </ListItem>
            <ListItem button component={Link} to="/formateur/my-formations">
              <ListItemIcon sx={{ color: "white" }}>
                <FaTasks />
              </ListItemIcon>
              {open && (
                <ListItemText
                  primary="Mes Formations"
                  sx={{ color: "white" }}
                />
              )}
            </ListItem>
          </>
        )}
        {role === "apprenant" && (
          <>
            <ListItem button component={Link} to="/apprenant">
              <ListItemIcon sx={{ color: "white" }}>
                <FaTachometerAlt />
              </ListItemIcon>
              {open && (
                <ListItemText
                  primary="Tableau de bord"
                  sx={{ color: "white" }}
                />
              )}
            </ListItem>
            <ListItem button component={Link} to="/apprenant/courses">
              <ListItemIcon sx={{ color: "white" }}>
                <FaFileAlt />
              </ListItemIcon>
              {open && (
                <ListItemText
                  primary="Voir les formations"
                  sx={{ color: "white" }}
                />
              )}
            </ListItem>
            <ListItem button component={Link} to="/apprenant/profile">
              <ListItemIcon sx={{ color: "white" }}>
                <FaUser />
              </ListItemIcon>
              {open && (
                <ListItemText primary="Profil" sx={{ color: "white" }} />
              )}
            </ListItem>
          </>
        )}
        <ListItem button onClick={handleLogout}>
          <ListItemIcon sx={{ color: "white" }}>
            <FaSignOutAlt />
          </ListItemIcon>
          {open && (
            <ListItemText primary="Déconnexion" sx={{ color: "white" }} />
          )}
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;

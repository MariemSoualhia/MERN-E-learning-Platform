import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  Divider,
  Menu,
  MenuItem,
  Avatar,
  Typography,
  Box,
  Collapse,
} from "@mui/material";
import {
  FaTachometerAlt,
  FaUser,
  FaFileAlt,
  FaTasks,
  FaSignOutAlt,
  FaBell,
  FaChevronRight,
  FaChevronDown,
  FaCode,
  FaNetworkWired,
  FaProjectDiagram,
} from "react-icons/fa";
import { Table, Button, message, Badge, Modal, List as AntList } from "antd";
import { BellOutlined } from "@ant-design/icons";
import axios from "axios";
import io from "socket.io-client";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { styled, useTheme } from "@mui/material/styles";

const drawerWidth = 240;

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
  const [openSpecialtyMenu, setOpenSpecialtyMenu] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [user] = useState(() =>
    JSON.parse(localStorage.getItem("currentuser"))
  );
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get(
          "http://localhost:5000/api/formations/notifications",
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );
        setNotifications(response.data);
        console.log(("les notif de vous", response.data));
        setNotificationCount(response.data.length);
      } catch (error) {
        message.error("Erreur lors de la récupération des notifications");
        console.error(error);
      }
    };

    fetchNotifications();

    const socket = io("http://localhost:5000");

    // Rejoindre une salle spécifique à l'utilisateur
    socket.emit("joinRoom", user._id, () => {
      console.log(`User joined room: ${user._id}`);
    });

    socket.on("newFormation", (formation) => {
      if (formation.formateur._id === user.id || user.role === "admin") {
        message.info("Une nouvelle formation a été ajoutée !");
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          { type: "newFormation", formation },
        ]);
        setNotificationCount((prevCount) => prevCount + 1);
      }
    });
    socket.on("test", (notification) => {
      if (notification.user.toString() === user.id) {
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          { type: notification.type, ...notification },
        ]);
        setNotificationCount((prevCount) => prevCount + 1);
      }
    });
    socket.on("formationStatusUpdated", (formation) => {
      if (formation.formateur._id === user.id || user.role === "formateur") {
        message.info("Le statut d'une formation a été mis à jour !");
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          { type: "formationStatusUpdated", formation },
        ]);
        setNotificationCount((prevCount) => prevCount + 1);
      }
    });

    // Gérer les notifications pour les nouvelles inscriptions
    socket.on("newEnrollment", (notification) => {
      if (user.role === "admin") {
        message.info(notification.message);
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          { type: "newEnrollment", ...notification }, // Utilisation de l'opérateur spread pour inclure toutes les propriétés de notification
        ]);
        setNotificationCount((prevCount) => prevCount + 1);
      }
    });

    return () => socket.disconnect();
  }, [user.id, user.role]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
    setOpenSpecialtyMenu(false); // Fermer le sous-menu lorsque la barre latérale se ferme
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    localStorage.removeItem("token");
    localStorage.removeItem("currentuser");
    navigate("/");
  };

  const toggleSpecialtyMenu = () => {
    setOpenSpecialtyMenu((prevOpenSpecialtyMenu) => !prevOpenSpecialtyMenu);
  };

  const handleNotificationClick = async () => {
    setIsModalVisible(true);
    const token = localStorage.getItem("token");

    try {
      await axios.put(
        "http://localhost:5000/api/formations/notifications/mark-as-read",
        {},
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );
      setNotificationCount(0);
    } catch (error) {
      message.error("Erreur lors de la mise à jour des notifications");
      console.error(error);
    }
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleNotificationItemClick = (notification) => {
    if (notification.type === "newFormation") {
      navigate("/admin/pending-formations");
    }
    if (notification.type === "newEnrollment") {
      navigate("/admin/pending-inscriptions");
    } else if (notification.type === "formationStatusUpdated") {
      if (role === "admin") {
        navigate("/admin/pending-formations");
      } else if (role === "formateur") {
        navigate("/formateur/my-formations");
      }
    }
    setIsModalVisible(false);
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{ zIndex: theme.zIndex.drawer + 1, backgroundColor: "#1E3A8A" }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" noWrap component="div">
            {user.name} - {user.email}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Badge count={notificationCount} showZero>
              <BellOutlined
                style={{ fontSize: "24px", cursor: "pointer", color: "white" }}
                onClick={handleNotificationClick}
              />
            </Badge>
            <IconButton color="inherit" onClick={handleMenu}>
              <Avatar src={user.photoProfil} />
            </IconButton>
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
        </Toolbar>
      </AppBar>

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
          "& .MuiDrawer-paper": {
            backgroundColor: "#1E3A8A", // Fond de la barre latérale
            color: "#FFFFFF", // Le texte de la barre latérale sera toujours blanc
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
        <Divider sx={{ borderColor: "white" }} />
        <List>
          {role === "admin" && (
            <>
              <ListItem button component={Link} to="/admin">
                <ListItemIcon sx={{ color: "white" }}>
                  <FaTachometerAlt />
                </ListItemIcon>
                {open && (
                  <Typography variant="body1" sx={{ color: "white" }}>
                    Tableau de bord
                  </Typography>
                )}
              </ListItem>
              <ListItem button component={Link} to="/admin/pending-formations">
                <ListItemIcon sx={{ color: "white" }}>
                  <FaTachometerAlt />
                </ListItemIcon>
                {open && (
                  <Typography variant="body1" sx={{ color: "white" }}>
                    Formation en attente
                  </Typography>
                )}
              </ListItem>
              <ListItem button component={Link} to="/admin/formations">
                <ListItemIcon sx={{ color: "white" }}>
                  <FaUser />
                </ListItemIcon>
                {open && (
                  <Typography variant="body1" sx={{ color: "white" }}>
                    Gestion des formations
                  </Typography>
                )}
              </ListItem>
              <ListItem button component={Link} to="/admin/formateurs">
                <ListItemIcon sx={{ color: "white" }}>
                  <FaUser />
                </ListItemIcon>
                {open && (
                  <Typography variant="body1" sx={{ color: "white" }}>
                    Gestion des formateurs
                  </Typography>
                )}
              </ListItem>
              <ListItem button component={Link} to="/admin/apprenants">
                <ListItemIcon sx={{ color: "white" }}>
                  <FaUser />
                </ListItemIcon>
                {open && (
                  <Typography variant="body1" sx={{ color: "white" }}>
                    Gestion des apprenants
                  </Typography>
                )}
              </ListItem>
              <ListItem button component={Link} to="/admin/courses">
                <ListItemIcon sx={{ color: "white" }}>
                  <FaFileAlt />
                </ListItemIcon>
                {open && (
                  <Typography variant="body1" sx={{ color: "white" }}>
                    Gestion des cours
                  </Typography>
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
                  <Typography variant="body1" sx={{ color: "white" }}>
                    Tableau de bord
                  </Typography>
                )}
              </ListItem>
              <ListItem button component={Link} to="/formateur/add-formation">
                <ListItemIcon sx={{ color: "white" }}>
                  <FaFileAlt />
                </ListItemIcon>
                {open && (
                  <Typography variant="body1" sx={{ color: "white" }}>
                    Ajouter une formation
                  </Typography>
                )}
              </ListItem>
              <ListItem button component={Link} to="/formateur/my-formations">
                <ListItemIcon sx={{ color: "white" }}>
                  <FaTasks />
                </ListItemIcon>
                {open && (
                  <Typography variant="body1" sx={{ color: "white" }}>
                    Mes Formations
                  </Typography>
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
                  <Typography variant="body1" sx={{ color: "white" }}>
                    Tableau de bord
                  </Typography>
                )}
              </ListItem>
              <ListItem button onClick={toggleSpecialtyMenu}>
                <ListItemIcon sx={{ color: "white" }}>
                  <FaFileAlt />
                </ListItemIcon>
                {open && (
                  <>
                    <Typography variant="body1" sx={{ color: "white" }}>
                      Voir les formations
                    </Typography>
                    <ListItemIcon sx={{ color: "white" }}>
                      {openSpecialtyMenu ? (
                        <FaChevronDown />
                      ) : (
                        <FaChevronRight />
                      )}
                    </ListItemIcon>
                  </>
                )}
              </ListItem>
              <Collapse in={openSpecialtyMenu} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItem
                    button
                    component={Link}
                    to="/apprenant/formations/dev"
                    sx={{ pl: 8, color: "white" }} // Indentation pour indiquer le sous-menu
                  >
                    <ListItemIcon sx={{ color: "white" }}>
                      <FaCode /> {/* Icône pour Développement */}
                    </ListItemIcon>
                    <Typography variant="body2" sx={{ color: "white" }}>
                      Développement
                    </Typography>
                  </ListItem>
                  <ListItem
                    button
                    component={Link}
                    to="/apprenant/formations/reseau"
                    sx={{ pl: 8, color: "white" }} // Indentation pour indiquer le sous-menu
                  >
                    <ListItemIcon sx={{ color: "white" }}>
                      <FaNetworkWired /> {/* Icône pour Réseau */}
                    </ListItemIcon>
                    <Typography variant="body2" sx={{ color: "white" }}>
                      Réseau
                    </Typography>
                  </ListItem>
                  <ListItem
                    button
                    component={Link}
                    to="/apprenant/formations/gestion-de-projets"
                    sx={{ pl: 8, color: "white" }} // Indentation pour indiquer le sous-menu
                  >
                    <ListItemIcon sx={{ color: "white" }}>
                      <FaProjectDiagram /> {/* Icône pour Gestion de projets */}
                    </ListItemIcon>
                    <Typography variant="body2" sx={{ color: "white" }}>
                      Gestion de projets
                    </Typography>
                  </ListItem>
                </List>
              </Collapse>
              <ListItem button component={Link} to="/apprenant/myEnrollments">
                <ListItemIcon sx={{ color: "white" }}>
                  <FaTachometerAlt />
                </ListItemIcon>
                {open && (
                  <Typography variant="body1" sx={{ color: "white" }}>
                    suivre mes inscriptions
                  </Typography>
                )}
              </ListItem>
              <ListItem button onClick={handleLogout}>
                <ListItemIcon sx={{ color: "white" }}>
                  <FaSignOutAlt />
                </ListItemIcon>
                {open && (
                  <Typography variant="body1" sx={{ color: "white" }}>
                    Déconnexion
                  </Typography>
                )}
              </ListItem>
            </>
          )}
        </List>
      </Drawer>

      <Modal
        title="Notifications"
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
        <AntList
          dataSource={notifications}
          renderItem={(notification) => (
            <AntList.Item
              onClick={() => handleNotificationItemClick(notification)}
              style={{ cursor: "pointer" }}
            >
              {notification.type === "newFormation" && (
                <div>
                  Nouvelle formation ajoutée : {notification.formation.title}
                </div>
              )}
              {notification.type === "formationStatusUpdated" && (
                <div>
                  Statut de la formation mis à jour :{" "}
                  {notification.formation.title}
                </div>
              )}
              {notification.type === "enrollmentAccepted" && (
                <div>
                  Inscription acceptée pour la formation :{" "}
                  {notification.formation.title}
                </div>
              )}
              {notification.type === "enrollmentRejected" && (
                <div>
                  Inscription rejetée pour la formation :{" "}
                  {notification.formation.title}
                </div>
              )}
              {notification.type == "newEnrollment" && (
                <div>Notification : {notification.message}</div>
              )}
              {/* Fallback au cas où le type n'est pas reconnu */}
              {![
                "newFormation",
                "newEnrollment",
                "formationStatusUpdated",
                "enrollmentAccepted",
                "enrollmentRejected",
              ].includes(notification.type) && (
                <div>Notification : {notification.message}</div>
              )}
            </AntList.Item>
          )}
        />
      </Modal>
    </>
  );
};

export default Sidebar;

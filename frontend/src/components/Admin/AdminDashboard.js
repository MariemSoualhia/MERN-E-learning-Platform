import React, { useEffect, useState } from "react";
import { Container, Typography, Box } from "@mui/material";
import Sidebar from "../navbar/Sidebar";
import PendingFormations from "./PendingFormations";
import { Table, Button, message, Badge, Modal, List } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  BellOutlined,
} from "@ant-design/icons";
import axios from "axios";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [formations, setFormations] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchFormations = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get(
          "http://localhost:5000/api/formations/pending",
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );
        setFormations(response.data);
      } catch (error) {
        message.error("Erreur lors de la récupération des formations");
        console.error(error);
      }
    };

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
        console.log(response.data);
        setNotificationCount(response.data.length);
      } catch (error) {
        message.error("Erreur lors de la récupération des notifications");
        console.error(error);
      }
    };

    fetchFormations();
    fetchNotifications();

    const socket = io("http://localhost:5000");
    socket.on("newFormation", (formation) => {
      message.info("Une nouvelle formation a été ajoutée !");
      setFormations((prevFormations) => [...prevFormations, formation]);
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        { type: "newFormation", formation },
      ]);
      setNotificationCount((prevCount) => prevCount + 1);
    });

    socket.on("formationStatusUpdated", (formation) => {
      message.info("Le statut d'une formation a été mis à jour !");
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        { type: "formationStatusUpdated", formation },
      ]);
      setNotificationCount((prevCount) => prevCount + 1);
    });

    return () => socket.disconnect();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/formations/update-status/${id}`,
        { status },
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );
      setFormations(formations.filter((formation) => formation._id !== id));
      message.success("Formation mise à jour avec succès");
    } catch (error) {
      message.error("Erreur lors de la mise à jour de la formation");
    }
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
    setIsModalVisible(false);
  };
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar role="admin" />
      <Container sx={{ flexGrow: 1, p: 3, backgroundColor: "#f4f6f8" }}>
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Tableau de bord Admin
          </Typography>
          <Typography>
            Bienvenue sur votre tableau de bord, Admin. Gérez les utilisateurs,
            les cours, et les inscriptions ici.
          </Typography>
          {/* <PendingFormations /> */}
          <Badge count={notificationCount} showZero>
            <BellOutlined
              style={{ fontSize: "24px", cursor: "pointer" }}
              onClick={handleNotificationClick}
            />
          </Badge>

          <Modal
            title="Notifications"
            visible={isModalVisible}
            onCancel={handleModalClose}
            footer={null}
          >
            <List
              dataSource={notifications}
              renderItem={(notification) => (
                <List.Item
                  onClick={() => handleNotificationItemClick(notification)}
                >
                  {notification.type === "newFormation" && (
                    <div>
                      Nouvelle formation ajoutée :{" "}
                      {notification.formation.title}
                    </div>
                  )}
                  {notification.type === "formationStatusUpdated" && (
                    <div>
                      Statut de la formation mis à jour :{" "}
                      {notification.formation.title}
                    </div>
                  )}
                </List.Item>
              )}
            />
          </Modal>
        </Box>
      </Container>
    </Box>
  );
};

export default AdminDashboard;

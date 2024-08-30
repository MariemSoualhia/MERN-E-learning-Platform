import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Modal,
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import { message } from "antd";
import axios from "axios";
import Sidebar from "../navbar/Sidebar";

const VideoManagement = () => {
  const [formations, setFormations] = useState([]);
  const [currentFormation, setCurrentFormation] = useState(null);
  const [videos, setVideos] = useState([]);
  const [videoVisible, setVideoVisible] = useState(false);
  const [newVideo, setNewVideo] = useState({ url: "", title: "" });

  useEffect(() => {
    fetchFormations();
  }, []);

  const fetchFormations = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/formations/my-formations",
        {
          headers: { "x-auth-token": localStorage.getItem("token") },
        }
      );
      setFormations(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchVideos = async (formationId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/formations/videos/${formationId}`,
        {
          headers: { "x-auth-token": localStorage.getItem("token") },
        }
      );
      setVideos(res.data.videos);
    } catch (error) {
      console.error(error);
      message.error("Erreur lors de la récupération des vidéos.");
    }
  };

  const handleOpenVideoModal = (formation) => {
    setCurrentFormation(formation);
    fetchVideos(formation._id);
    setVideoVisible(true);
  };

  const handleVideoSubmit = async () => {
    const { url, title } = newVideo;
    if (!url || !title) {
      message.error("Veuillez remplir tous les champs.");
      return;
    }

    try {
      await axios.post(
        `http://localhost:5000/api/formations/videos/upload/${currentFormation._id}`,
        { url, title },
        {
          headers: { "x-auth-token": localStorage.getItem("token") },
        }
      );
      message.success("Vidéo téléchargée avec succès !");
      fetchVideos(currentFormation._id);
      setNewVideo({ url: "", title: "" });
    } catch (error) {
      console.error(error);
      message.error("Erreur lors du téléchargement de la vidéo.");
    }
  };

  const handleDeleteVideo = async (videoId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/formations/videos/${currentFormation._id}/${videoId}`,
        {
          headers: { "x-auth-token": localStorage.getItem("token") },
        }
      );
      message.success("Vidéo supprimée avec succès !");
      fetchVideos(currentFormation._id);
    } catch (error) {
      console.error(error);
      message.error("Erreur lors de la suppression de la vidéo.");
    }
  };

  return (
    <Box sx={{ marginTop: "50px", display: "flex", minHeight: "100vh" }}>
      <Sidebar role="formateur" />
      <Container sx={{ padding: 3, backgroundColor: "#F1F1F1", width: "100%" }}>
        <Typography variant="h2" gutterBottom>
          Gestion des Vidéos
        </Typography>

        <Grid container spacing={2}>
          {formations.map((formation) => (
            <Grid item xs={12} sm={6} md={4} key={formation._id}>
              <Card sx={{ padding: 2, borderRadius: "8px" }}>
                <Box sx={{ position: "relative", height: "40%" }}>
                  <Typography variant="h5" sx={{ mt: 2 }}>
                    {formation.title}
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{ mt: 2 }}
                    onClick={() => handleOpenVideoModal(formation)}
                  >
                    Voir les Vidéos
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Modal
          open={videoVisible}
          onClose={() => setVideoVisible(false)}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1300,
            backdropFilter: "blur(3px)",
          }}
        >
          <Box
            sx={{
              backgroundColor: "white",
              padding: 3,
              borderRadius: 2,
              maxHeight: "80vh",
              overflowY: "auto",
            }}
          >
            <Typography variant="h4" gutterBottom>
              Vidéos pour {currentFormation?.title}
            </Typography>
            <List>
              {videos.map((video) => (
                <ListItem key={video._id}>
                  <ListItemText primary={video.title} secondary={video.url} />
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteVideo(video._id)}
                  >
                    <DeleteOutlined />
                  </IconButton>
                </ListItem>
              ))}
            </List>
            <Divider sx={{ my: 2 }} />
            <TextField
              label="Titre de la vidéo"
              fullWidth
              value={newVideo.title}
              onChange={(e) =>
                setNewVideo((prev) => ({ ...prev, title: e.target.value }))
              }
              sx={{ mb: 2 }}
            />
            <TextField
              label="URL de la vidéo"
              fullWidth
              value={newVideo.url}
              onChange={(e) =>
                setNewVideo((prev) => ({ ...prev, url: e.target.value }))
              }
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              onClick={handleVideoSubmit}
              startIcon={<UploadOutlined />}
            >
              Télécharger la Vidéo
            </Button>
          </Box>
        </Modal>
      </Container>
    </Box>
  );
};

export default VideoManagement;

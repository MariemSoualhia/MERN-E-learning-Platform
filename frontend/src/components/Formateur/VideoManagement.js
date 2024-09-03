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
import {
  DeleteOutlined,
  UploadOutlined,
  Close as CloseIcon,
} from "@mui/icons-material";
import { message } from "antd";
import axios from "axios";
import Sidebar from "../navbar/Sidebar";
import theme from "../../theme"; // Import the custom theme

const VideoManagement = () => {
  const [formations, setFormations] = useState([]);
  const [currentFormation, setCurrentFormation] = useState(null);
  const [videos, setVideos] = useState([]);
  const [videoVisible, setVideoVisible] = useState(false);
  const [newVideo, setNewVideo] = useState({ file: null, title: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const videosPerPage = 4;

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
    if (!newVideo.file || !newVideo.title) {
      message.error("Veuillez remplir tous les champs.");
      return;
    }

    const formData = new FormData();
    formData.append("video", newVideo.file);
    formData.append("title", newVideo.title);

    try {
      await axios.post(
        `http://localhost:5000/api/formations/videos/upload/${currentFormation._id}`,
        formData,
        {
          headers: {
            "x-auth-token": localStorage.getItem("token"),
            "Content-Type": "multipart/form-data",
          },
        }
      );
      message.success("Vidéo téléchargée avec succès !");
      fetchVideos(currentFormation._id);
      setNewVideo({ file: null, title: "" });
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

  const handleCloseModal = () => {
    setVideoVisible(false);
    setCurrentPage(1); // Reset to the first page when closing
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Paginate videos
  const indexOfLastVideo = currentPage * videosPerPage;
  const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
  const currentVideos = videos.slice(indexOfFirstVideo, indexOfLastVideo);

  return (
    <Box sx={{ marginTop: "50px", display: "flex", minHeight: "100vh" }}>
      <Sidebar role="formateur" />
      <Container
        sx={{
          padding: 3,
          backgroundColor: theme.palette.background.default,
          width: "100%",
        }}
      >
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
          onClose={handleCloseModal}
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
              padding: 4,
              borderRadius: 2,
              width: "80vw",
              maxHeight: "80vh",
              overflowY: "auto",
              position: "relative",
            }}
          >
            <IconButton
              onClick={handleCloseModal}
              sx={{
                position: "absolute",
                top: 10,
                right: 10,
                color: theme.palette.primary.main,
              }}
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h4" gutterBottom sx={{ textAlign: "center" }}>
              Vidéos pour {currentFormation?.title}
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              {currentVideos.map((video, index) => (
                <Grid item xs={12} sm={6} key={video._id}>
                  <Typography variant="h6">{video.title}</Typography>
                  <video
                    width="100%"
                    height="300px"
                    controls
                    crossOrigin="anonymous"
                    style={{ borderRadius: 8 }}
                  >
                    <source
                      src={`http://localhost:5000/api/formations/videos/serve/${currentFormation._id}/${index}`}
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteVideo(video._id)}
                    sx={{ mt: 1 }}
                  >
                    <DeleteOutlined />
                  </IconButton>
                </Grid>
              ))}
            </Grid>

            {/* Pagination controls */}
            {videos.length > videosPerPage && (
              <Box sx={{ textAlign: "center", mt: 3 }}>
                {[...Array(Math.ceil(videos.length / videosPerPage))].map(
                  (e, i) => (
                    <Button
                      key={i}
                      variant="contained"
                      sx={{
                        margin: "0 5px",
                        backgroundColor:
                          currentPage === i + 1
                            ? theme.palette.primary.main
                            : theme.palette.secondary.main,
                      }}
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  )
                )}
              </Box>
            )}

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
            <input
              type="file"
              accept="video/*"
              onChange={(e) =>
                setNewVideo((prev) => ({ ...prev, file: e.target.files[0] }))
              }
              style={{ display: "block", marginBottom: "16px" }}
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

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
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { message } from "antd";
import axios from "axios";
import Sidebar from "../navbar/Sidebar";
import theme from "../../theme"; // Ensure you import your custom theme

const VideoManagementForApprenant = () => {
  const [formationsBySpecialty, setFormationsBySpecialty] = useState({
    upcoming: {},
    completed: {},
  });
  const [currentFormation, setCurrentFormation] = useState(null);
  const [videos, setVideos] = useState([]);
  const [videoVisible, setVideoVisible] = useState(false);
  const [filterQuery, setFilterQuery] = useState(""); // State for filtering videos
  const [currentPage, setCurrentPage] = useState(1); // State for pagination
  const videosPerPage = 4; // Number of videos per page

  useEffect(() => {
    fetchFormations();
  }, []);

  const fetchFormations = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await axios.get(
        "http://localhost:5000/api/formations/my-enrollments",
        {
          headers: { "x-auth-token": token },
        }
      );
      setFormationsBySpecialty(res.data);
    } catch (error) {
      console.error(error);
      message.error("Erreur lors de la récupération des formations.");
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

  const handleFilterChange = (event) => {
    setFilterQuery(event.target.value);
  };

  const handleCloseModal = () => {
    setVideoVisible(false);
    setCurrentPage(1); // Reset to the first page when closing
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Calculate the index of the videos to display based on current page
  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(filterQuery.toLowerCase())
  );
  const indexOfLastVideo = currentPage * videosPerPage;
  const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
  const currentVideos = filteredVideos.slice(
    indexOfFirstVideo,
    indexOfLastVideo
  );

  return (
    <Box sx={{ marginTop: "50px", display: "flex", minHeight: "100vh" }}>
      <Sidebar role="apprenant" />
      <Container
        sx={{
          padding: 3,
          backgroundColor: theme.palette.background.default,
          width: "100%",
        }}
      >
        <Typography variant="h2" gutterBottom>
          Mes Formations et Vidéos
        </Typography>

        {/* Formations à venir */}
        <Typography variant="h4" gutterBottom>
          Formations à venir
        </Typography>
        {Object.keys(formationsBySpecialty.upcoming).map((specialty) => (
          <Box key={specialty} sx={{ mb: 4 }}>
            <Typography variant="h5">{specialty}</Typography>
            <Grid container spacing={3}>
              {formationsBySpecialty.upcoming[specialty].map((formation) => (
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
          </Box>
        ))}

        {/* Formations terminées */}
        <Typography variant="h4" gutterBottom>
          Formations terminées
        </Typography>
        {Object.keys(formationsBySpecialty.completed).map((specialty) => (
          <Box key={specialty} sx={{ mb: 4 }}>
            <Typography variant="h5">{specialty}</Typography>
            <Grid container spacing={3}>
              {formationsBySpecialty.completed[specialty].map((formation) => (
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
          </Box>
        ))}

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

            <TextField
              label="Filtrer par titre de vidéo"
              variant="outlined"
              fullWidth
              value={filterQuery}
              onChange={handleFilterChange}
              sx={{ mb: 3 }}
            />

            <Grid container spacing={3}>
              {currentVideos.length > 0 ? (
                currentVideos.map((video, index) => (
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
                  </Grid>
                ))
              ) : (
                <Typography variant="body1">
                  Pas de vidéos disponibles pour cette formation.
                </Typography>
              )}
            </Grid>

            {/* Pagination controls */}
            {filteredVideos.length > videosPerPage && (
              <Box sx={{ textAlign: "center", mt: 3 }}>
                {[
                  ...Array(Math.ceil(filteredVideos.length / videosPerPage)),
                ].map((e, i) => (
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
                ))}
              </Box>
            )}
          </Box>
        </Modal>
      </Container>
    </Box>
  );
};

export default VideoManagementForApprenant;

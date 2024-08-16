import React from "react";
import { Container, Typography, Button, Box, Grid, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

const images = [
  "http://localhost:5000/static-images/image 1.jpg",
  "http://localhost:5000/static-images/image 3.jpg",
  "http://localhost:5000/static-images/image 2.jpg",
];

const HeroSection = styled(Box)({
  minHeight: "60vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "#00000",
  textAlign: "center",
  padding: "20px",
  overflow: "hidden",
});

const StyledSlider = styled(Slider)({
  width: "100%",
  height: "100%",
  ".slick-slide img": {
    width: "120%",
    height: "65vh",
    objectFit: "cover",
  },
  ".slick-dots li button:before": {
    color: "#fff",
  },
});

const AnimatedTypography = styled(Typography)({
  opacity: 0,
  transform: "translateY(20px)",
  transition: "all 0.5s ease-in-out",
  "&.visible": {
    opacity: 1,
    transform: "translateY(0)",
  },
});

const Home = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <>
      <HeroSection>
        <StyledSlider {...settings}>
          {images.map((image, index) => (
            <div key={index}>
              <img src={image} alt={`Slide ${index}`} />
            </div>
          ))}
        </StyledSlider>
        <Container sx={{ position: "absolute", zIndex: 2 }}>
          <AnimatedTypography
            variant="h2"
            component="h1"
            gutterBottom
            className="visible"
          >
            Bienvenue sur CNILearn
          </AnimatedTypography>
          <AnimatedTypography
            variant="h5"
            component="h2"
            gutterBottom
            className="visible"
          >
            La plateforme e-learning pour un enseignement moderne et interactif
          </AnimatedTypography>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Button
              variant="contained"
              color="primary"
              size="large"
              href="/register"
              sx={{
                "&:hover": {
                  transform: "scale(1.05)",
                  transition: "transform 0.3s ease-in-out",
                },
              }}
            >
              Inscrivez-vous maintenant
            </Button>
          </motion.div>
          {/* Ajout du lien "Voir nos formations" ici */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            sx={{ mt: 2 }}
          >
            <Button
              variant="outlined"
              color="secondary"
              size="large"
              component={Link}
              to="/formations"
              sx={{
                "&:hover": {
                  transform: "scale(1.05)",
                  transition: "transform 0.3s ease-in-out",
                },
              }}
            >
              Voir nos formations
            </Button>
          </motion.div>
        </Container>
      </HeroSection>

      {/* Reste du code de la page Home */}
      <Container sx={{ py: 5 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Nos Formations
        </Typography>
        <Grid container spacing={4}>
          {["Développement Web", "Big Data", "Gestion de Projets"].map(
            (course, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h5" component="h3">
                      {course}
                    </Typography>
                    <Typography>
                      {course === "Développement Web"
                        ? "Apprenez à créer des sites web interactifs et modernes avec les dernières technologies."
                        : course === "Big Data"
                        ? "Découvrez comment analyser et traiter de grandes quantités de données pour en extraire des informations précieuses."
                        : "Maîtrisez les techniques de gestion de projets pour mener à bien vos initiatives professionnelles."}
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
            )
          )}
        </Grid>
      </Container>

      <Box sx={{ bgcolor: "#F1F1F1", py: 5 }}>
        <Container>
          <Typography variant="h4" component="h2" gutterBottom>
            Pourquoi choisir CNILearn ?
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" component="h3">
                Cours de qualité
              </Typography>
              <Typography>
                Nos cours sont conçus par des experts du domaine pour vous
                offrir un apprentissage de qualité supérieure.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" component="h3">
                Apprentissage flexible
              </Typography>
              <Typography>
                Apprenez à votre propre rythme, quand et où vous le souhaitez.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" component="h3">
                Support 24/7
              </Typography>
              <Typography>
                Notre équipe de support est disponible 24/7 pour répondre à
                toutes vos questions et vous aider en cas de besoin.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container sx={{ py: 5 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Témoignages
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" component="h3">
                Alice Dupont
              </Typography>
              <Typography>
                "CNILearn m'a permis d'acquérir de nouvelles compétences et de
                progresser dans ma carrière. Les cours sont excellents et très
                bien structurés."
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" component="h3">
                Jean Martin
              </Typography>
              <Typography>
                "La flexibilité des cours m'a permis d'apprendre à mon propre
                rythme. Le support est toujours disponible pour m'aider en cas
                de besoin."
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <Box sx={{ bgcolor: "#1E3A8A", color: "#FFFFFF", py: 3 }}>
        <Container>
          <Typography variant="h6" component="h3" align="center">
            Rejoignez CNILearn aujourd'hui et commencez votre parcours
            d'apprentissage!
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              href="/register"
              sx={{
                "&:hover": {
                  transform: "scale(1.05)",
                  transition: "transform 0.3s ease-in-out",
                },
              }}
            >
              Inscrivez-vous maintenant
            </Button>
          </Box>
        </Container>
      </Box>

      <Box sx={{ bgcolor: "#0D1B47", color: "#FFFFFF", py: 2 }}>
        <Container>
          <Typography variant="body2" align="center">
            © 2024 CNILearn. Tous droits réservés.
          </Typography>
        </Container>
      </Box>
    </>
  );
};

export default Home;

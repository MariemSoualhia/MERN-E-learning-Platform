import React from "react";
import { Container, Typography, Button, Box, Grid, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";

const HeroSection = styled(Box)({
  backgroundImage: `url('https://media.istockphoto.com/id/1360520509/fr/photo/homme-daffaires-utilisant-un-ordinateur-pour-webinaire-en-ligne-%C3%A9ducation-sur-internet.jpg?s=2048x2048&w=is&k=20&c=X3VNSHB_SvOw1UNIIkBpFV4y3cxkrO9AGKphUOl3IpU=')`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  minHeight: "60vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "#fff",
  textAlign: "center",
  padding: "20px",
});

const Home = () => {
  return (
    <>
      <HeroSection>
        <Container>
          <Typography variant="h2" component="h1" gutterBottom>
            Bienvenue sur EduBravo
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            La plateforme e-learning pour un enseignement moderne et interactif
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            href="/register"
          >
            Inscrivez-vous maintenant
          </Button>
        </Container>
      </HeroSection>

      <Container sx={{ py: 5 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Nos Formations
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h5" component="h3">
                Développement Web
              </Typography>
              <Typography>
                Apprenez à créer des sites web interactifs et modernes avec les
                dernières technologies.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h5" component="h3">
                Big Data
              </Typography>
              <Typography>
                Découvrez comment analyser et traiter de grandes quantités de
                données pour en extraire des informations précieuses.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h5" component="h3">
                Gestion de Projets
              </Typography>
              <Typography>
                Maîtrisez les techniques de gestion de projets pour mener à bien
                vos initiatives professionnelles.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <Box sx={{ bgcolor: "#F1F1F1", py: 5 }}>
        <Container>
          <Typography variant="h4" component="h2" gutterBottom>
            Pourquoi choisir EduBravo ?
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
                "EduBravo m'a permis d'acquérir de nouvelles compétences et de
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
            Rejoignez EduBravo aujourd'hui et commencez votre parcours
            d'apprentissage!
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              href="/register"
            >
              Inscrivez-vous maintenant
            </Button>
          </Box>
        </Container>
      </Box>

      <Box sx={{ bgcolor: "#0D1B47", color: "#FFFFFF", py: 2 }}>
        <Container>
          <Typography variant="body2" align="center">
            © 2023 EduBravo. Tous droits réservés.
          </Typography>
        </Container>
      </Box>
    </>
  );
};

export default Home;

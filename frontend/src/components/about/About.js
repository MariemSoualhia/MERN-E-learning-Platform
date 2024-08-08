import React from "react";
import { Container, Typography, Box, Grid, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";

const AboutSection = styled(Box)({
  backgroundSize: "cover",
  backgroundPosition: "center",
  minHeight: "40vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "#fff",
  textAlign: "center",
  padding: "20px",
  backgroundColor: "#1E3A8A",
});

const About = () => {
  return (
    <>
      <AboutSection>
        <Container>
          <Typography variant="h2" component="h1" gutterBottom>
            À propos de nous
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            En savoir plus sur EduBravo et notre mission
          </Typography>
        </Container>
      </AboutSection>

      <Container sx={{ py: 5 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Notre Mission
        </Typography>
        <Typography paragraph>
          Chez EduBravo, nous nous engageons à fournir une éducation de qualité
          accessible à tous. Nous croyons que l'apprentissage en ligne peut
          transformer des vies et ouvrir de nouvelles opportunités. Notre
          mission est de rendre l'apprentissage accessible, flexible et
          abordable pour tout le monde, partout dans le monde.
        </Typography>
        <Typography paragraph>
          Nous proposons une large gamme de cours conçus par des experts du
          domaine, couvrant divers sujets tels que le développement web, le big
          data, et la gestion de projets. Nos cours sont conçus pour être
          interactifs, engageants, et pratiques, permettant aux apprenants de
          développer des compétences précieuses et pertinentes pour le marché du
          travail actuel.
        </Typography>
        <Typography paragraph>
          Rejoignez-nous dans notre mission et commencez votre parcours
          d'apprentissage avec EduBravo aujourd'hui !
        </Typography>

        <Grid container spacing={4} sx={{ mt: 5 }}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" component="h3">
                Notre Histoire
              </Typography>
              <Typography>
                EduBravo a été fondé en 2021 avec la vision de rendre
                l'éducation de qualité accessible à tous. Depuis lors, nous
                avons aidé des milliers d'apprenants à atteindre leurs objectifs
                éducatifs et professionnels.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" component="h3">
                Notre Équipe
              </Typography>
              <Typography>
                Notre équipe est composée de professionnels passionnés par
                l'éducation et la technologie. Nous travaillons sans relâche
                pour fournir les meilleurs cours et le meilleur support à nos
                apprenants.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default About;

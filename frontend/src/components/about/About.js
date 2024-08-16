import React from "react";
import { Container, Typography, Box, Grid, Paper, Avatar } from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";

const AboutSection = styled(Box)({
  backgroundImage: `url('http://localhost:5000/static-images/image 1.jpg')`,
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

const TeamSection = styled(Box)({
  backgroundImage: `url('http://localhost:5000/static-images/team-background.jpg')`, // Remplacez par l'URL de votre image de fond
  backgroundSize: "cover",
  backgroundPosition: "center",
  minHeight: "60vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "#fff",
  textAlign: "center",
  padding: "60px 20px",
});

const TeamMemberCard = styled(Paper)({
  padding: "20px",
  textAlign: "center",
  backgroundColor: "rgba(255, 255, 255, 0.8)",
  borderRadius: "10px",
});

const teamMembers = [
  {
    name: "Gadraoui Sawsen",
    title: "CEO",
    image: "https://www.linkpicture.com/q/alice.jpg", // Remplacez par l'URL de l'image
  },
  {
    name: "Soualhia Mariem",
    title: "CTO",
    image:
      "http://localhost:5000/static-images/photoProfil-1723733877236-517119126.png", // Remplacez par l'URL de l'image
  },
  {
    name: "Marie Curie",
    title: "Lead Developer",
    image: "https://www.linkpicture.com/q/marie.jpg", // Remplacez par l'URL de l'image
  },
  {
    name: "Paul Verlaine",
    title: "Designer",
    image: "https://www.linkpicture.com/q/paul.jpg", // Remplacez par l'URL de l'image
  },
];

const About = () => {
  return (
    <>
      <AboutSection>
        <Container>
          <Typography variant="h2" component="h1" gutterBottom>
            À propos de nous
          </Typography>
          <Typography variant="h4" component="h2" gutterBottom>
            En savoir plus sur CNILearn et notre mission
          </Typography>
        </Container>
      </AboutSection>

      <Container sx={{ py: 5 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Notre Mission
        </Typography>
        <Typography paragraph>
          Chez CNILearn, nous nous engageons à fournir une éducation de qualité
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
          d'apprentissage avec CNILearn aujourd'hui !
        </Typography>
      </Container>

      <TeamSection>
        <Container>
          <Typography variant="h4" component="h2" gutterBottom>
            Notre Équipe
          </Typography>
          <Grid container spacing={4}>
            {teamMembers.map((member, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <TeamMemberCard elevation={3}>
                    <Avatar
                      src={member.image}
                      alt={member.name}
                      sx={{ width: 100, height: 100, margin: "auto", mb: 2 }}
                    />
                    <Typography variant="h6" component="h3">
                      {member.name}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      {member.title}
                    </Typography>
                  </TeamMemberCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </TeamSection>
    </>
  );
};

export default About;

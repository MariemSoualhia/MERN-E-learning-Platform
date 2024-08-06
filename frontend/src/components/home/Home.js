import React from "react";
import { Container, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <Container>
      <div style={{ textAlign: "center", padding: "50px 0" }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Envie de partir à l'étranger?
        </Typography>
        <Typography variant="h6" component="p" gutterBottom>
          EduBravo vous guide en vidéo et vous accompagne dans toutes vos
          démarches.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/about"
        >
          Découvrez EduBravo
        </Button>
      </div>
      <div>
        <Typography variant="h4" component="h2" gutterBottom>
          Cours disponibles
        </Typography>
        <div className="row">
          <div className="col-md-4">
            <div className="card">
              <img
                src="path_to_image"
                className="card-img-top"
                alt="Course 1"
              />
              <div className="card-body">
                <h5 className="card-title">Langage de développement web</h5>
                <p className="card-text">
                  Apprenez les bases de la programmation web avec PHP.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card">
              <img
                src="path_to_image"
                className="card-img-top"
                alt="Course 2"
              />
              <div className="card-body">
                <h5 className="card-title">Traitement du Big Data</h5>
                <p className="card-text">
                  Maîtrisez les techniques de traitement des données massives.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card">
              <img
                src="path_to_image"
                className="card-img-top"
                alt="Course 3"
              />
              <div className="card-body">
                <h5 className="card-title">Développement mobile</h5>
                <p className="card-text">
                  Découvrez les bases du développement d'applications mobiles.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Home;

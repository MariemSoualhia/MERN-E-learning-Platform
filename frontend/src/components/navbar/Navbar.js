import React from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          EduBravo
        </Typography>
        <Button color="inherit" component={Link} to="/">
          Accueil
        </Button>
        <Button color="inherit" component={Link} to="/about">
          À propos
        </Button>
        <Button color="inherit" component={Link} to="/contact">
          Contactez-nous
        </Button>
        <Button color="inherit" component={Link} to="/login">
          Connexion
        </Button>
        <Button color="inherit" component={Link} to="/register">
          Inscription
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

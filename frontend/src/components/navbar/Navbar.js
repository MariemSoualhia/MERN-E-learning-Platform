import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            MyApp
          </Link>
        </Typography>
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

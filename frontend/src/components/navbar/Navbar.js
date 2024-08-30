import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <img
            src="http://localhost:5000/static-images/e-learning.png"
            alt="Logo"
            style={{ width: 40, height: 40, marginRight: 10 }}
          />
          <Typography variant="h6">
            <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
              CNILearn
            </Link>
          </Typography>
        </Box>
        <Button color="inherit" component={Link} to="/about">
          À propos
        </Button>
        <Button color="inherit" component={Link} to="/contact">
          Contact
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

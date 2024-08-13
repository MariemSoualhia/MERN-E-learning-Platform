import React from "react";
import { List, ListItem, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";

const specialties = [
  { name: "Développement", value: "dev" },
  { name: "Réseau", value: "reseau" },
  { name: "Gestion de projets", value: "gestion-de-projets" },
];

const SpecialtyMenu = () => {
  return (
    <List>
      {specialties.map((specialty) => (
        <ListItem
          button
          key={specialty.value}
          component={Link}
          to={`/apprenant/formations/${specialty.value}`}
        >
          <ListItemText primary={specialty.name} />
        </ListItem>
      ))}
    </List>
  );
};

export default SpecialtyMenu;

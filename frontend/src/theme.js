import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1E3A8A", // Bleu Foncé
    },
    secondary: {
      main: "#424242", // Gris Foncé pour les éléments secondaires
    },
    background: {
      default: "#F1F1F1", // Gris Clair pour le fond
    },
    text: {
      primary: "#424242", // Texte gris foncé pour le reste de l'application
      secondary: "#1E3A8A", // Texte bleu foncé pour les liens et titres
    },
  },
  typography: {
    h1: {
      fontFamily: "Arial, sans-serif",
      fontWeight: "bold",
      fontSize: "36px",
      color: "#0D1B47",
    },
    h2: {
      fontFamily: "Arial, sans-serif",
      fontWeight: "bold",
      fontSize: "30px",
      color: "#0D1B47",
      textAlign: "center",
    },
    h3: {
      fontFamily: "Arial, sans-serif",
      fontWeight: "bold",
      fontSize: "24px",
      color: "#0D1B47",
    },
    h4: {
      fontFamily: "Arial, sans-serif",
      fontWeight: "bold",
      fontSize: "20px",
      color: "#0D1B47",
    },
    body1: {
      fontFamily: "Georgia, serif",
      fontSize: "16px",
      color: "#424242", // Texte en gris foncé pour le corps
    },
    button: {
      textTransform: "none",
      fontSize: "16px",
      padding: "10px 20px",
      borderRadius: "8px",
      transition: "all 0.3s ease",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontSize: "16px",
          borderRadius: "8px",
          transition: "all 0.3s ease",
          backgroundColor: "#1E3A8A", // Bleu Foncé
          color: "#FFFFFF", // Texte des boutons en blanc
          "&:hover": {
            backgroundColor: "#0D1B47", // Bleu Très Foncé pour le survol
            boxShadow: "0px 5px 7px rgba(0, 0, 0, 0.3)",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#1E3A8A", // Bleu Foncé pour la navbar
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& label.Mui-focused": {
            color: "#1E3A8A", // Couleur du label des champs de texte en bleu foncé
          },
          "& .MuiInput-underline:after": {
            borderBottomColor: "#1E3A8A", // Soulignement en bleu foncé
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#424242", // Bordure des champs de texte en gris foncé
            },
            "&:hover fieldset": {
              borderColor: "#1E3A8A", // Bordure en bleu foncé au survol
            },
            "&.Mui-focused fieldset": {
              borderColor: "#1E3A8A", // Bordure en bleu foncé lorsque le champ est actif
            },
            color: "#424242", // Texte des champs de texte en gris foncé
          },
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        root: {
          color: "#FFFFFF", // Texte blanc pour les éléments du menu latéral
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: "#FFFFFF", // Icônes en blanc pour les éléments du menu latéral
        },
      },
    },
  },
});

export default theme;

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
      primary: "#424242", // Gris Foncé pour le texte
      secondary: "#1E3A8A", // Bleu Foncé pour les liens et titres
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
      color: "#424242",
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
          padding: "10px 20px",
          borderRadius: "8px",

          transition: "all 0.3s ease",
          backgroundColor: "#1E3A8A", // Bleu Foncé
          color: "#FFFFFF",
          "&:hover": {
            backgroundColor: "#0D1B47", // Bleu Très Foncé pour le survol
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
            color: "#1E3A8A",
          },
          "& .MuiInput-underline:after": {
            borderBottomColor: "#1E3A8A",
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#424242",
            },
            "&:hover fieldset": {
              borderColor: "#1E3A8A",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#1E3A8A",
            },
          },
        },
      },
    },
  },
});

export default theme;

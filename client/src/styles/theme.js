
// client/src/styles/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#9c7206" },
    secondary: { main: "#84620a" },
    tertiary:{main: "#FFF085"},
    background: { default: "transparent" }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "transparent !important",
          color: "inherit",
        },
      },
    },
  },
});

export default theme;



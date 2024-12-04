// src/main.tsx

import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#FF7F50", // Coral color
    },
    secondary: {
      main: "#FF6347", // Tomato color
    },
  },
  typography: {
    fontFamily: "Montserrat, Arial, sans-serif",
    h2: {
      fontWeight: 800,
    },
    h3: {
      fontWeight: 700,
    },
    button: {
      textTransform: "none",
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

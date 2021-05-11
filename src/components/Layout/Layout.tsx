import React from "react";
import { CssBaseline, ThemeProvider, Container } from "@material-ui/core";
import { AlertContext, initialAlert } from "../../App";
import Alert from "@material-ui/lab/Alert";

import { Header } from "../Header/Header";
import { Footer } from "../Footer";
import theme from "../../theme";

export const Layout: React.FC = ({ children }) => {
  const {
    alert: { state, severity, message },
    setAlert,
  } = React.useContext(AlertContext);
  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Header />
        {state && (
          <Alert onClose={() => setAlert(initialAlert)} severity={severity}>
            {message}
          </Alert>
        )}
        <Container maxWidth="xl">{children}</Container>
        <Footer />
      </ThemeProvider>
    </>
  );
};

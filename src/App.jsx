import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { useEffect, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { authUtils } from "./utils/authUtils";
import LoadingScreen from "./components/global/LoadingScreen";
import SignupForm from "./auth/SignupForm";
import LoginForm from "./auth/LoginForm";
import DrawerAndBar from "./components/layout/DrawerAndBar";
import { UserProvider } from "./context/UserContext";

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState("loading");

  useEffect(() => {
    const token = localStorage.getItem('dirwin-dealer-token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    authUtils.removeToken();
    setIsLoggedIn(false);
  };

  if (isLoggedIn === "loading") {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LoadingScreen />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route
              path="/login"
              element={
                isLoggedIn ?
                  <Navigate to="/" replace /> :
                  <LoginForm onLogin={handleLogin} />
              }
            />
            <Route
              path="/signup"
              element={
                isLoggedIn ?
                  <Navigate to="/" replace /> :
                  <SignupForm onSignup={handleLogin} />
              }
            />
            <Route
              path="/*"
              element={
                isLoggedIn ?
                  <UserProvider>
                    <DrawerAndBar onLogout={handleLogout} />
                  </UserProvider>
                  :
                  <Navigate to="/login" replace />
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
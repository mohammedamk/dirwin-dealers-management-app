import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { useEffect, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import LoginForm from "./components/auth/LoginForm";
import SignupForm from "./components/auth/SignupForm";
import Dashboard from "./components/layout/dashboard/Dashboard";
import authUtils from "./utils/authUtils";
import LoadingScreen from "./components/global/LoadingScreen";

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
                  <Navigate to="/dashboard" replace /> :
                  <LoginForm onLogin={handleLogin} />
              }
            />
            <Route
              path="/signup"
              element={
                isLoggedIn ?
                  <Navigate to="/dashboard" replace /> :
                  <SignupForm onSignup={handleLogin} />
              }
            />
            <Route
              path="/dashboard/*"
              element={
                isLoggedIn ?
                  <Dashboard onLogout={handleLogout} /> :
                  <Navigate to="/login" replace />
              }
            />
            <Route
              path="/"
              element={
                isLoggedIn ?
                  <Navigate to="/dashboard" replace /> :
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
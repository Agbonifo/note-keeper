// client/src/components/App.jsx
import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { StyledEngineProvider } from "@mui/material/styles";
import theme from "../styles/theme";
import Layout from "./Layout/Layout";
import ProtectedRoute from "./Auth/ProtectedRoute";
import ErrorBoundary from "./common/ErrorBoundary";

import { fetchCsrfToken } from "../api/api";

import Dashboard from "../pages/Dashboard";
import LoginPage from "../pages/Auth/LoginPage";
import RegisterPage from "../pages/Auth/RegisterPage";
import EmailVerificationPage from "./Auth/EmailVerificationPage";
import ForgotPasswordPage from "../pages/Auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/Auth/ResetPasswordPage";
import ChangePasswordPage from "../pages/Auth/ChangePasswordPage";
import ProfilePage from "../pages/UserProfilePage";

export default function App() {
   useEffect(() => {
    fetchCsrfToken();
  }, []);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app-background">
          <ErrorBoundary>
            <Layout>
              <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/create-account" element={<RegisterPage />} />
                <Route
                  path="/verify-email/:token"
                  element={<EmailVerificationPage />}
                />
                <Route
                  path="/verify-email"
                  element={<EmailVerificationPage />}
                />
                <Route
                  path="/forgot-password"
                  element={<ForgotPasswordPage />}
                />
                <Route
                  path="/reset-password/:token"
                  element={<ResetPasswordPage />}
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/change-password"
                  element={
                    <ProtectedRoute>
                      <ChangePasswordPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Layout>
          </ErrorBoundary>
        </div>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}



  // client/src/components/Auth/EmailVerificationPage.jsx
  import { useEffect, useState } from "react";
  import api from "../../api/api";
  import { useParams, useNavigate } from "react-router-dom";
  import {
    Box,
    Typography,
    CircularProgress,
    Button,
    Alert,
  } from "@mui/material";

  export default function EmailVerificationPage() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [state, setState] = useState({
      status: token ? "verifying" : "awaiting-verification",
      message: token
        ? "Verifying your email..."
        : "Please check your email for verification link",
      isProcessing: false,
    });

    useEffect(() => {
      if (!token) return;

      const verifyEmail = async () => {
        try {
          setState((prev) => ({ ...prev, isProcessing: true }));
         
          const response = await api.get(`/auth/verify-email/${token}`, { headers: {"Cache-Control": "no-cache"}});
          
          if (response.data.success) {
            setState({
              status: "verified",
                message: response.data.message || "Email verified successfully!",
              isProcessing: false,
            });
            setTimeout(() => navigate("/login"), 3000);
          } else {
            setState({
              status: "error",
              message: response.data.message || "Verification failed",
              isProcessing: false,
            });
          }
        } catch (error) {
          let errorMessage = "Verification failed. Please try again.";
          if (error.response?.status === 429) {
            errorMessage =
              "Too many attempts. Please wait 15 minutes and try again.";
          } else if (error.response?.status === 400) {
            errorMessage =
              "Invalid verification link. Please request a new one.";
          }

          setState({
            status: "error",
            message: errorMessage,
            isProcessing: false,
          });
        }
      };

      const timer = setTimeout(verifyEmail, 500);
      return () => clearTimeout(timer);
    }, [token, navigate]);

    return (
      <Box sx={{ maxWidth: 600, mx: "auto", mt: 8, p: 3, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Email Verification
        </Typography>

        {state.isProcessing && (
          <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", my: 2 }}>
            <CircularProgress size={24} />
            <Typography variant="body2" sx={{ ml: 2 }}>
              Verifying...
            </Typography>
          </Box>
        )}
        {!state.isProcessing && state.status === "verified" && (
          <Alert
            severity="success"
            sx={{
              mb: 2,
              "& .MuiAlert-message": {
                textAlign: "center",
                width: "100%",
              },
            }}
          >
            {state.message}
            <Typography component="div" variant="body2" sx={{ mt: 1 }}>
              Redirecting to sign in...
            </Typography>
          </Alert>
        )}

        {!state.isProcessing && state.status === "error" && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {state.message}
            <Button
              variant="outlined"
              sx={{ mt: 2 }}
              onClick={() => navigate("/create-account")}
            >
              Back to Registration
            </Button>
          </Alert>
        )}

        {!state.isProcessing && state.status === "awaiting-verification" && (
          <>
            <Typography>{state.message}</Typography>
            <Button
              variant="outlined"
              sx={{ mt: 2 }}
              onClick={() => navigate("/create-account")}
            >
              Back to Registration
            </Button>
          </>
        )}
      </Box>
    );
  }








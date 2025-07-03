// client/src/components/Auth/ResetPassword.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Alert, CircularProgress } from "@mui/material";
import { resetPassword, verifyResetPasswordToken } from "../../api/auth";
import AuthForm from "./Form/AuthForm";
import {
  validatePassword,
  validateConfirmPassword,
  validateVerificationCode,
} from "../../utils/validators";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState(false);
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      try {
        await verifyResetPasswordToken(token);
        setTokenValid(true);
      } catch (err) {
        // setApiError("Reset link is invalid or has expired.");
        setApiError(err.response?.data.message);
      } finally {
        setLoading(false);
      }
    };
    checkToken();
  }, [token]);

  const handleSubmit = async (formData) => {
    try {
      setApiError("");
      setLoading(true);
      await resetPassword(token, formData.password);
      setSuccessMessage(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setApiError(err.response?.data?.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      name: "password",
      label: "New Password",
      type: "password",
      validate: validatePassword,
    },
    {
      name: "passwordConfirm",
      label: "Confirm Password",
      type: "password",
      validate: (value, values) => validateConfirmPassword(value, values),
    },
    {
      name: "verification",
      label: "Verification Code",
      type: "text",
      inputProps: {
        maxLength: 4,
        inputMode: "numeric",
        pattern: "[0-9]*",
      },
      validate: validateVerificationCode,
    },
  ];

  if (loading) return <CircularProgress sx={{ mt: 4 }} />;

  return (
    <Box>
      {successMessage ? (
        <Alert severity="success" align="center" sx={{ mb: 2 }}>
          Password reset successfully! Redirecting to sign in...
        </Alert>
      ) : tokenValid ? (
        <AuthForm
          title="Create New Password"
          fields={fields}
          onSubmit={handleSubmit}
          buttonText="Reset Password"
          isLoading={loading}
          error={apiError}
          showLinks={false}
        />
      ) : (
        <Alert severity="error" align="center" sx={{ mt: 4 }}>
          {apiError}
        </Alert>
      )}
    </Box>
  );
}

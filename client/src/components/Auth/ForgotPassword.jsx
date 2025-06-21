// client/src/components/Auth/ForgotPassword.jsx
import { useState } from "react";
import { Box, Alert } from "@mui/material";
import { forgotPassword } from "../../api/auth";
import AuthForm from "./Form/AuthForm";
import {
  validateEmail,
  validateVerificationCode,
} from "../../utils/validators";

export default function ForgotPassword() {
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setApiError("");
      setSuccessMessage("");
      setLoading(true);
      const response = await forgotPassword(formData.email);
      setSuccessMessage(response.message);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      name: "email",
      label: "Email",
      type: "email",
      validate: validateEmail,
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

  return (
    <Box>
      {successMessage ? (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      ) : (
        <AuthForm
          title="Password Recovery"
          fields={fields}
          onSubmit={handleSubmit}
          buttonText="Send Reset Link"
          isLoading={loading}
          error={apiError}
          showLinks={false}
        />
      )}
    </Box>
  );
}

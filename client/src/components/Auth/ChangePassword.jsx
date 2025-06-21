// client/src/components/Auth/ChangePassword.jsx
import { useState } from "react";
import { Box, Alert } from "@mui/material";
import AuthForm from "./Form/AuthForm";
import { changePassword } from "../../api/auth";
import {
  validatePassword,
  validateConfirmPassword,
  validateLoginInput,
  validateVerificationCode,
} from "../../utils/validators";
import useAuth from "../../hooks/useAuth";

export default function ChangePassword() {
  const [successMessage, setSuccessMessage] = useState(false);
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const { logout } = useAuth();

  const handleSubmit = async (formData) => {
    try {
      setApiError("");
      setLoading(true);
      await changePassword({
        oldPassword: formData.oldPassword,
        newPassword: formData.password,
      });
      setSuccessMessage(true);
      setTimeout(() => {
        logout();
      }, 3000);
    } catch (err) {
      setApiError(err.response?.data?.message || "Password change failed");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      name: "oldPassword",
      label: "Current Password",
      type: "password",
      validate: validateLoginInput,
    },
    {
      name: "password",
      label: "New Password",
      type: "password",
      validate: validatePassword,
    },
    {
      name: "passwordConfirm",
      label: "Confirm New Password",
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

  return (
    <Box>
      {successMessage && (
        <Alert severity="success">
          Password changed successfully! Redirecting to sign in...
        </Alert>
      )}

      {!successMessage && (
        <AuthForm
          title="Change Password"
          fields={fields}
          onSubmit={handleSubmit}
          buttonText="Change Password"
          loading={loading}
          error={apiError}
          showLinks={false}
        />
      )}
    </Box>
  );
}

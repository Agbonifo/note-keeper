// client/src/components/Auth/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import AuthForm from "./Form/AuthForm";
import { Box } from "@mui/material";
import {
  validateLoginInput,
  validateLoginPassword,
  validateVerificationCode
} from "../../utils/validators";

export default function Login() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      setError("");
      setLoading(true);
      await login(formData.emailOrUsername, formData.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to log in");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      name: "emailOrUsername",
      label: "Email or Username",
      type: "text",
      validate: validateLoginInput,
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      validate: validateLoginPassword,
    },
{
  name: "verification",
  label: "Verification Code",
  type: "text",
  inputProps: {
    maxLength: 4,
    inputMode: "numeric",
    pattern: "[0-9]*"
  },
  validate: validateVerificationCode
}
  ];

  return (
    <Box>
      <AuthForm
        title="Sign In"
        fields={fields}
        onSubmit={handleSubmit}
        buttonText="Sign in"
        isLoading={loading}
        error={error}
      />
    </Box>
  );
}

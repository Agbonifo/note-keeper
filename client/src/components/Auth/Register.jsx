// client/src/components/Auth/Register.jsx
import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import AuthForm from "./Form/AuthForm";
import { Box } from "@mui/material";
import {
  validateEmail,
  validateUsername,
  validatePassword,
  validateConfirmPassword,
  validateVerificationCode
} from "../../utils/validators";

export default function Register() {
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (formData) => {
    try {
      setApiError("");
      setLoading(true);
      await register(formData);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      name: "username",
      label: "Username",
      validate: validateUsername,
      autoFocus: true,
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      validate: validateEmail,
    },
    {
      name: "password",
      label: "Password",
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
    pattern: "[0-9]*"
  },
  validate: validateVerificationCode
},
    {
      name: "acceptTerms",
      label: "I acknowledge and accept the above notice.",
      type: "checkbox",
      initialValue: false,
      validate: (value) => {
        if (value !== true) {
          return "You must acknowledge and accept the notice to proceed.";
        }
        return "";
      },
      required: true,
    },
  ];

  return (
    <Box>
      <AuthForm
        title="Create Account"
        fields={fields}
        onSubmit={handleSubmit}
        buttonText="Create Account"
        isLoading={loading}
        error={apiError}
      />
    </Box>
  );
}



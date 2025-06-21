// client/src/components/Auth/Form/AuthForm.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Box,
  Container,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
  InputAdornment,
  Grid,
  Link as MuiLink,
  Checkbox,
  Paper,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import useForm from "../../../hooks/useForm";
import FormField from "./FormField";
import AuthError from "./AuthError";

const generateCode = () => Math.floor(1000 + Math.random() * 9000).toString();

const AuthForm = ({
  title = "",
  subtitle = "",
  fields = [],
  onSubmit,
  buttonText = "Submit",
  isLoading = false,
  error = "",
}) => {
  const validationRules = {};
  fields.forEach((field) => {
    if (field.validate) {
      validationRules[field.name] = field.validate;
    }
  });

  const initialValues = fields.reduce((acc, field) => {
    acc[field.name] =
      field.type === "checkbox"
        ? field.initialValue || false
        : field.initialValue || "";
    return acc;
  }, {});

  const { values, errors, touched, handleChange, handleBlur, validateForm } =
    useForm(initialValues, validationRules);

  const [showPassword, setShowPassword] = useState({
    password: false,
    passwordConfirm: false,
  });

  const [formError, setFormError] = useState("");
  const [code, setCode] = useState(generateCode());

  const handleClickShowPassword = (fieldName) => {
    setShowPassword((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  };

  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    setCode(generateCode());
  }, []);

  const regenerateCode = () => {
    const newCode = generateCode();
    setCode(newCode);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isValid = validateForm();

    if (!isValid) {
      setFormError("Please fix the errors in the form.");
      regenerateCode();
      return;
    }

    const userCode = values.verification;
    if (userCode !== code) {
      setFormError("Incorrect verification code.");
      regenerateCode();
      return;
    }

    setFormError("");
    onSubmit(values);
  };

  return (
    <Container sx={{ mt: 1, mb: 2 }}>
      <Box>
        {title && (
          <Typography
            variant="h5"
            align="center"
            gutterBottom
            fontSize="1.5rem"
          >
            {title}
          </Typography>
        )}
        {subtitle && (
          <Typography variant="h6" align="center" gutterBottom fontSize="1rem">
            {subtitle}
          </Typography>
        )}

        <AuthError error={error} />

        {formError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {formError}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          {fields.map((field) => {
            const isPasswordField = field.type === "password";
            const showPasswordForField = showPassword[field.name] || false;

            if (field.name === "verification") {
              return (
                <Box
                  key={field.name}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Grid>
                    <FormField
                      name={field.name}
                      label={field.label}
                      type={field.type}
                      inputProps={field.inputProps}
                      value={values[field.name]}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched[field.name] && errors[field.name]}
                      required={field.required !== false}
                    />
                  </Grid>
                  <Grid>
                    <Paper
                      sx={{
                        py: 0.5,
                        px: 1,
                        background: "#d9d9d9",
                        color: "#9c7206",
                        textAlign: "center",
                        fontWeight: "bold",
                        fontStyle: "italic",
                        fontSize: "1.3rem",
                        letterSpacing: "0.1em",
                        userSelect: "none",
                      }}
                    >
                      {code}
                    </Paper>
                  </Grid>
                </Box>
              );
            }

            if (field.type === "checkbox") {
              return (
                <Box
                  key={field.name}
                  sx={{ mt: 2, display: "flex", alignItems: "flex-start" }}
                >
                  <Checkbox
                    size="small"
                    checked={!!values[field.name]}
                    onChange={(e) =>
                      handleChange({
                        target: {
                          name: field.name,
                          type: "checkbox",
                          checked: e.target.checked,
                        },
                      })
                    }
                    onBlur={(e) =>
                      handleBlur({
                        target: {
                          name: field.name,
                          type: "checkbox",
                          checked: e.target.checked,
                        },
                      })
                    }
                    name={field.name}
                    required={field.required !== false}
                    sx={{ mt: 0.3 }}
                  />
                  <Box sx={{ mt: 1.6 }}>
                    <Typography variant="body2" fontSize="0.8rem">
                      {field.label}
                    </Typography>
                    {touched[field.name] && errors[field.name] && (
                      <Typography
                        variant="body2"
                        color="error"
                        sx={{ mt: 0.5 }}
                      >
                        {errors[field.name]}
                      </Typography>
                    )}
                  </Box>
                </Box>
              );
            }

            return (
              <FormField
                key={field.name}
                name={field.name}
                label={field.label}
                type={
                  isPasswordField && !showPasswordForField ? "password" : "text"
                }
                value={values[field.name] || ""}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched[field.name] && errors[field.name]}
                autoFocus={field.autoFocus}
                required={field.required !== false}
                inputProps={
                  isPasswordField
                    ? {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() =>
                                handleClickShowPassword(field.name)
                              }
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {showPasswordForField ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }
                    : undefined
                }
              />
            );
          })}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, fontSize: ".8rem" }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : buttonText}
          </Button>
        </Box>
        <Box>
          {title === "Sign In" && (
            <Grid display="flex" justifyContent="space-between" width="100%">
              <Grid>
                <MuiLink
                  component={Link}
                  to="/forgot-password"
                  variant="body2"
                  sx={{ textDecoration: "none" }}
                >
                  Forgot password?
                </MuiLink>
              </Grid>
              <Grid>
                <MuiLink
                  component={Link}
                  to="/create-account"
                  variant="body2"
                  sx={{ textDecoration: "none" }}
                >
                  Create New Account
                </MuiLink>
              </Grid>
            </Grid>
          )}
          {title === "Create Account" && (
            <Grid>
              <Typography variant="body2" component="span">
                Have an account?{" "}
                <MuiLink
                  component={Link}
                  to="/login"
                  variant="body2"
                  sx={{ textDecoration: "none" }}
                >
                  Sign in
                </MuiLink>
              </Typography>
            </Grid>
          )}
          {title === "Password Recovery" && (
            <Grid>
              <Typography variant="body2" component="span">
                Remember your password?{" "}
                <MuiLink
                  component={Link}
                  to="/login"
                  variant="body2"
                  sx={{ textDecoration: "none" }}
                >
                  Sign in
                </MuiLink>
              </Typography>
            </Grid>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default AuthForm;

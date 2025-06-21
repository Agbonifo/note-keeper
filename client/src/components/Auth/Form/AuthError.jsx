// client/src/components/Auth/Form/AuthError.jsx
import { Alert } from "@mui/material";

export default function AuthError({ error }) {
  if (!error) return null;
  
  return (
    <Alert severity="error" sx={{ mb: 2 }}>
      {error}
    </Alert>
  );
}
// // client/src/components/User/AccountDeleteDialog.jsx
import { useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { deleteUser } from "../../api/users";
import useAuth from "../../hooks/useAuth";

const AccountDeleteDialog = ({ open, handleClose }) => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [password, setPassword] = useState("");
  const {logout} = useAuth();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setError("");
      await deleteUser(password);
      setSuccess(true);
      setTimeout(() => {
        logout();
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Failed to delete account. Please try again."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle color="error">Delete Your Account</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <strong>Warning:</strong> This will permanently delete:
        </DialogContentText>

        <ul style={{ marginLeft: "20px", marginTop: "8px" }}>
          <li>Your account credentials</li>
          <li>All your created notes</li>
          <li>All your chat messages</li>
          <li>Any other data associated with your account</li>
        </ul>

        <DialogContentText sx={{ mt: 2 }}>
          This action cannot be undone. Are you sure you want to proceed?
        </DialogContentText>
        <TextField
          fullWidth
          label="Enter your password to confirm"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          variant="outlined"
          margin="normal"
          required
        />
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {apiError}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Account and all associated data deleted successfully. Redirecting...
          </Alert>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleDelete}
          color="error"
          disabled={!password || isDeleting || success}
          variant="contained"
        >
          {isDeleting ? "Deleting..." : "Confirm Deletion"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AccountDeleteDialog;

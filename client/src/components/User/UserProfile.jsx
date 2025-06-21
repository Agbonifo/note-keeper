import { useState } from "react";
import { Box, TextField, Button, Paper  } from "@mui/material";
import AccountDeleteDialog from "./AccountDeleteDialog";
import useAuth from "../../hooks/useAuth";

export default function UserProfile() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { user } = useAuth();

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
      <Box mb={3}>
        <TextField
          fullWidth
          margin="normal"
          label="Username"
          name="username"
          value={user.username.charAt(0).toUpperCase() + user.username.slice(1)}
          slotProps={{ input: { readOnly: true } }}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          type="email"
          name="email"
          value={user.email}
          slotProps={{ input: { readOnly: true } }}
          helperText="Contact admin to update username or email."
        />
      </Box>
         <Button 
              variant="contained" 
              color="error"
              onClick={() => setDeleteDialogOpen(true)}
            >
              Delete Account
            </Button>
            
            <AccountDeleteDialog 
              open={deleteDialogOpen}
              handleClose={() => setDeleteDialogOpen(false)}
            />
    </Paper>
  );
}

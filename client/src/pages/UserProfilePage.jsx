import { Container, Typography, Box } from "@mui/material";
import UserProfile from "../components/User/UserProfile";

export default function ProfilePage() {
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom color="primary">
          Account Overview
        </Typography>
        <UserProfile />
      </Box>
    </Container>
  );
}
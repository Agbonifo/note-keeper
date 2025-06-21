// client/src/pages/Dashboard.jsx

import { Container, Box } from "@mui/material";
import NoteApp from "../components/Notes/NoteApp";

export default function Dashboard() {
  return (
    <Container
      maxWidth="xl"
      sx={{
        mt: 4,
        mb: 4,
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <Box sx={{ flex: 1 }}>
        <NoteApp />
      </Box>
    </Container>
  );
}
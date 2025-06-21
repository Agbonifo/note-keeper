// client/src/components/Layout/Footer/Footer.jsx

import { Box, Typography } from "@mui/material";

export default function Footer() {

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: "auto",
        backgroundColor: (theme) => theme.palette.primary.main,
        color: "#d9d9d9",
        textAlign: "center",
      }}
    >
      <Typography variant="body2">
        &copy; {new Date().getFullYear()} Note Keeper App | Daniel Agbonifo. All rights reserved.
      </Typography>
    </Box>
  );
}


import { Box, Typography } from "@mui/material";

const Logo = ({ sx }) => {
  return (
    <Box sx={{ 
      display: "flex",
      alignItems: "center",
      ...sx 
    }}>
      <img 
        src="/assets/images/logo.png" 
        alt="Logo" 
        style={{ height: 40, marginRight: 2 }} 
      />
      <Typography variant="p" fontWeight="bold">
        NoteKeeper
      </Typography>
    </Box>
  );
};

export default Logo;
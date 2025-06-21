// client/src/components/Auth/Declaimer.jsx
import { Box, Typography, Checkbox, FormControlLabel } from "@mui/material";
import { useState } from "react";

const DisclaimerNotice = ({ showCheckbox = false, onAcceptChange }) => {
  const [accepted, setAccepted] = useState(false);

  const handleAcceptChange = (event) => {
    setAccepted(event.target.checked);
    if (onAcceptChange) {
      onAcceptChange(event.target.checked);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom fontWeight="bold" fontSize="1.35rem" marginBottom="20px">
        ⚠️ Important Notice & Disclaimers
      </Typography>
      <Typography variant="body1" component="p">
        This is a personal portfolio project, not a production service.
      </Typography>
      
      <ul style={{ paddingLeft: "1rem", marginBottom: "1rem" }}>
        <li><Typography variant="body2">Do not store sensitive or important information.</Typography></li>
        <li><Typography variant="body2">Data may be lost without warning.</Typography></li>
        <li><Typography variant="body2">No uptime or support guarantees.</Typography></li>
        <li><Typography variant="body2">Use at your own risk.</Typography></li>
      </ul>

       <Typography variant="body2" component="p" fontWeight="450">
        By using this service, you acknowledge and accept these terms.
      </Typography>

      {showCheckbox && (
        <FormControlLabel
          control={
            <Checkbox 
              checked={accepted} 
              onChange={handleAcceptChange} 
              required
            />
          }
           label={field.label}
        />
      )}
    </Box>
  );
};

export default DisclaimerNotice;


// client/src/components/Chat/ChatStatusIcon.jsx
import { Done, DoneAll } from "@mui/icons-material";

const ChatStatusIcon = ({ message }) => {
  if (message.readBy?.some(id => id !== message.sender._id)) {
    return (
      <DoneAll
        fontSize="small"
        sx={{ color:  "tertiary.main", ml: 0.5 }}
        titleAccess="Read"
      />
    );
  } else if (message.deliveredTo?.some(id => id !== message.sender._id)) {
    return (
      <DoneAll
        fontSize="small"
        sx={{ color: "grey.400", ml: 0.4 }}
        titleAccess="Delivered"
      />
    );
  } else {
    return (
      <Done
        fontSize="small"
        sx={{ color: "grey.300", ml: 0.3  }}
        titleAccess="Sent"
      />
    );
  }
};

export default ChatStatusIcon;

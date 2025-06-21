import { useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  IconButton,
  Typography,
} from "@mui/material";
import { Delete, Edit, PushPin, ExpandMore } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import NoteEditor from "./NoteEditor";

const ExpandMoreButton = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function Note({ note = {}, onDelete, onUpdate }) {
  const [expanded, setExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const safeNote = {
    title: note.title || "",
    content: note.content || "",
    isPinned: note.isPinned || false,
    createdAt: note.createdAt || new Date(),
    _id: note._id || Math.random().toString(36).substr(2, 9),
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleSave = async (updatedNote) => {
    if (onUpdate && safeNote._id) {
      await onUpdate(safeNote._id, updatedNote);
    }
    setIsEditing(false);
  };

  const content = safeNote.content || "";
  const showExpand = content.length > 150;

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "23rem",
        border: "1.5px solid #9c7206",
        minHeight: 260,
        boxShadow: 3,
        transition: "transform 0.2s ease-in-out",
        "&:hover": {
          transform: "scale(1.01)",
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        {isEditing ? (
          <NoteEditor
            note={safeNote}
            onSave={handleSave}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <>
            <Typography
              variant="h5"
              component="div"
              sx={{ display: "flex", alignItems: "center" }}
            >
              {safeNote.isPinned && <PushPin color="primary" sx={{ mr: 1 }} />}
              {safeNote.title}
            </Typography>
            <Typography sx={{ mb: 1.5 }} variant="body2" color="text.secondary">
              {new Date(safeNote.createdAt).toLocaleDateString()}
            </Typography>

            <Typography component="div" sx={{background: "#9c7206", height: "6px"}}> </Typography>
              
        <Typography variant="body2"
        sx={{ mt: 3, whiteSpace: "pre-line", wordWrap: "break-word", overflowWrap: "break-word" }}
        >
              {showExpand && !expanded
                ? `${content.substring(0, 150)}...`
                : content}
            </Typography>
          </>
        )}
      </CardContent>
      <CardActions disableSpacing sx={{mb: 0}}>
        <IconButton aria-label="edit" onClick={() => setIsEditing(true)}>
          <Edit color="primary"/>
        </IconButton>
        <IconButton
          aria-label="delete"
          onClick={() => onDelete && safeNote._id && onDelete(safeNote._id)}
        >
          <Delete color="primary"/>
        </IconButton>
        {showExpand && (
          <ExpandMoreButton
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMore color="primary"/>
          </ExpandMoreButton>
        )}
      </CardActions>
    </Card>
  );
}





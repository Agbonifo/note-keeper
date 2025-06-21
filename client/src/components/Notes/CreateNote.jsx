import { useState } from "react";
import {
  Fab,
  TextField,
  Zoom,
  Typography,
  Box,
  Alert,
  Snackbar,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { formatSentenceCase } from "../../utils/helpers"

export default function CreateNote({ onAdd }) {
  const [note, setNote] = useState({ title: "", content: "" });
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState("");

  const MAX_WORDS = 200;

  const wordCount = note.content.trim().split(/\s+/).filter(Boolean).length;
  const remainingWords = MAX_WORDS - wordCount;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "content") {
      const wordCount = value.trim().split(/\s+/).filter(Boolean).length;
      if (wordCount > MAX_WORDS) return;
    }

    setNote((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanedTitle = formatSentenceCase(note.title.trim());
    const cleanedContent = formatSentenceCase(note.content.trim());

    if (!cleanedTitle || !cleanedContent) {
      setError("Both title and content are required.");
      return;
    }

    if (cleanedContent.split(/\s+/).length > MAX_WORDS) {
      setError(`Note exceeds the word limit of ${MAX_WORDS} words.`);
      return;
    }

    await onAdd({ title: cleanedTitle, content: cleanedContent });
    setNote({ title: "", content: "" });
    setIsExpanded(false);
  };

  function handleDoubleClick() {
    setIsExpanded(false);
  }

  return (
    <div>
      <form>
        {isExpanded && (
          <TextField
          autoCorrect="on"
          spellCheck={true}
          autoComplete="off"
            autoFocus
            fullWidth
            margin="normal"
            label="Title"
            name="title"
            value={formatSentenceCase(note.title)}
            onChange={handleChange}
            onDoubleClick={handleDoubleClick}
          />
        )}
        <TextField
          autoCorrect="on"
          spellCheck={true}
          autoComplete="off"
          fullWidth
          margin="normal"
          label={isExpanded ? "Content" : "Take a note..."}
          name="content"
          value={formatSentenceCase(note.content)}
          onChange={handleChange}
          onClick={() => setIsExpanded(true)}
          onDoubleClick={handleDoubleClick}
          multiline
          rows={isExpanded ? 3 : 1}
        />
        {isExpanded && (
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mt: 1 }}
          >
            <Zoom in={isExpanded}>
              <Fab
                color="primary"
                onClick={handleSubmit}
                disabled={!note.content || !note.title}
                size="small"
              >
                <Add />
              </Fab>
            </Zoom>
            <Typography
              variant="caption"
              color={
                remainingWords < 0
                  ? "error"
                  : remainingWords < 50
                  ? "warning.main"
                  : "text.secondary"
              }
            >
              {remainingWords} words remaining
            </Typography>
          </Box>
        )}
      </form>
      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={() => setError("")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setError("")}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
}

import { useState } from "react";
import { Box, TextField, Button, Typography, Alert, Snackbar } from "@mui/material";
import { formatSentenceCase } from "../../utils/helpers";

export default function NoteEditor({ note, onSave, onCancel }) {
  const [error, setError] = useState("");
  const [editedNote, setEditedNote] = useState({
    title: note.title,
    content: note.content,
  });

  const MAX_WORDS = 200;

  const wordCount = editedNote.content
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  const remainingWords = MAX_WORDS - wordCount;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "content") {
      const wordCount = value.trim().split(/\s+/).filter(Boolean).length;
      if (wordCount > MAX_WORDS) return;
    }

    setEditedNote((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanedTitle =  formatSentenceCase(editedNote.title.trim());
    const cleanedContent = formatSentenceCase(editedNote.content.trim());
  
    if (!cleanedTitle || !cleanedContent) {
      setError("Both title and content are required.");
      return;
    }
  
    if (cleanedContent.split(/\s+/).length > MAX_WORDS) {
      setError(`Note exceeds the word limit of ${MAX_WORDS} words.`);
      return;
    }
  
    onSave({ title: cleanedTitle, content: cleanedContent });
  };


  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField
        fullWidth
        margin="normal"
        label="Title"
        name="title"
        value={formatSentenceCase(editedNote.title)}
        onChange={handleChange}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Content"
        name="content"
        multiline
        rows={4}
       value={formatSentenceCase(editedNote.content)}
        onChange={handleChange}
      />
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mt: 2 }}
      >
        <Box>
          <Button type="submit" variant="contained" sx={{ mr: 2 }}>
            Save
          </Button>
          <Button variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
        </Box>
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
            <Snackbar 
        open={!!error}
        autoHideDuration={4000}
        onClose={() => setError("")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setError("")} severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}

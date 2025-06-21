import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import Note from "./Note";
import CreateNote from "./CreateNote";
import useStore from "../../store";
import {
  getNotes,
  createNote,
  updateNote as apiUpdateNote,
  deleteNote as apiDeleteNote,
} from "../../api/note";

export default function NoteApp() {
  const notes = useStore((state) => state.notes);
  const setNotes = useStore((state) => state.setNotes);
  const storeAddNote = useStore((state) => state.addNote);
  const storeUpdateNote = useStore((state) => state.updateNote);
  const storeDeleteNote = useStore((state) => state.deleteNote);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    noteId: null,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        const response = await getNotes();
        setNotes(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Error fetching notes:", err);
        setNotes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [setNotes]);

  const showNotification = (message, severity = "success") => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const openDeleteDialog = (id) => {
    setDeleteDialog({ open: true, noteId: id });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ open: false, noteId: null });
  };

  const handleAddNote = async (noteData) => {
    try {
      const response = await createNote(noteData);
      if (response.data) {
        storeAddNote(response.data);
        showNotification("Note created successfully");
      }
    } catch (err) {
      console.error("Error creating note:", err);
      showNotification("Failed to create note", "error");
    }
  };

  const handleUpdateNote = async (id, updatedNote) => {
    try {
      const response = await apiUpdateNote(id, updatedNote);
      if (response.data) {
        storeUpdateNote(id, response.data);
        showNotification("Note updated successfully");
      }
    } catch (err) {
      console.error("Error updating note:", err);
      showNotification("Failed to update note", "error");
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      await apiDeleteNote(id);
      storeDeleteNote(id);
      showNotification("Note deleted successfully");
    } catch (err) {
      console.error("Error deleting note:", err);
      showNotification("Failed to delete note", "error");
    } finally {
      closeDeleteDialog();
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box>
      <Typography variant="h5" gutterBottom align="center" color="primary.main" fontSize={"1.5rem"}>
        My Notes
      </Typography>
      <Box
        sx={{
          maxWidth: { xs: "100%", sm: "500px", md: "600px" },
          mx: "auto",
          p: 2,
        }}
      >
        <CreateNote onAdd={handleAddNote} />
      </Box>
      <Grid
        container
        spacing={3}
        alignItems={"flex-start"}
        sx={{
          justifyContent: "center",
        }}
      >
        {Array.isArray(notes) && notes.length > 0 ? (
          notes.map((note) => (
            <Grid key={note._id}>
              <Note
                note={note}
                onDelete={openDeleteDialog}
                onUpdate={handleUpdateNote}
              />
            </Grid>
          ))
        ) : (
          <Grid size="20">
            <Typography variant="body1" sx={{ p: 2 }}>
              No notes yet. Create your first note!
            </Typography>
          </Grid>
        )}
      </Grid>
      <Dialog
        open={deleteDialog.open}
        onClose={closeDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete Note?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this note? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog}>Cancel</Button>
          <Button
            onClick={() => handleDeleteNote(deleteDialog.noteId)}
            color="error"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

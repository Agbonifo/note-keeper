import express from "express";
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote
} from "../../../controllers/noteController.js";
import { protect } from "../../../middleware/auth.js";

const noteRoutes = express.Router();

noteRoutes.route("/")
  .get(protect, getNotes)
  .post(protect, createNote);

  noteRoutes.route("/:id")
  .put(protect, updateNote)
  .delete(protect, deleteNote);

export default noteRoutes;
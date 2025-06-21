import Note from "../models/Note.js";
import asyncHandler from "express-async-handler";
import sanitizeHtml from "sanitize-html";

export const getNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find({ user: req.user.id }).sort({
    isPinned: -1,
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    count: notes.length,
    data: notes,
  });
});

export const createNote = asyncHandler(async (req, res) => {
  const { title, content, tags } = req.body;

  const note = await Note.create({
    title: sanitizeHtml(title),
    content: sanitizeHtml(content),
    tags,
    user: req.user.id,
  });

  res.status(201).json({
    success: true,
    data: note,
  });
});

export const updateNote = asyncHandler(async (req, res) => {
  let note = await Note.findById(req.params.id);

  if (!note) {
    res.status(404);
    throw new Error("Note not found");
  }

  if (note.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Not authorized");
  }

  note = await Note.findByIdAndUpdate(
    req.params.id,
    {
      title: sanitizeHtml(req.body.title),
      content: sanitizeHtml(req.body.content),
      tags: req.body.tags,
      isPinned: req.body.isPinned,
    },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    data: note,
  });
});

export const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    res.status(404);
    throw new Error("Note not found");
  }

  if (note.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Not authorized");
  }

  await Note.deleteOne({ _id: req.params.id });

  res.status(200).json({
    success: true,
    data: {},
  });
});

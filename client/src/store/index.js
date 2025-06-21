// client/src/store/index.js

import { create } from "zustand";

const syncChatsToLocalStorage = (chats) => {
  localStorage.setItem("lastMessages", JSON.stringify(chats));
};

const useStore = create((set, get) => ({
  // ========== Notes ==========
  notes: [],
  setNotes: (notes) => set({ notes }),
  addNote: (note) => set((state) => ({ notes: [note, ...state.notes] })),
  updateNote: (id, updatedNote) =>
    set((state) => ({
      notes: state.notes.map((note) =>
        note._id === id ? { ...note, ...updatedNote } : note
      ),
    })),
  deleteNote: (id) =>
    set((state) => ({
      notes: state.notes.filter((note) => note._id !== id),
    })),

  // ========== Chats ==========
  chats: [],
  setChats: (chats) => {
    syncChatsToLocalStorage(chats);
    set({ chats });
  },

  addChat: (chat) =>
    set((state) => {
      if (state.chats.some((c) => c._id === chat._id)) return state;
      const updated = [...state.chats, chat];
      syncChatsToLocalStorage(updated);
      return { chats: updated };
    }),

  updateChat: (id, updatedChat) =>
    set((state) => {
      const updated = state.chats.map((chat) =>
        chat._id === id ? { ...chat, ...updatedChat } : chat
      );
      syncChatsToLocalStorage(updated);
      return { chats: updated };
    }),

  deleteChat: (id) =>
    set((state) => {
      const updated = state.chats.filter((chat) => chat._id !== id);
      syncChatsToLocalStorage(updated);
      return { chats: updated };
    }),

  clearChats: () => {
    syncChatsToLocalStorage([]);
    set({ chats: [] });
  },

  replaceChat: (tempId, realChat) =>
    set((state) => {
      const updated = state.chats.map((chat) =>
        chat._id === tempId ? realChat : chat
      );
      syncChatsToLocalStorage(updated);
      return { chats: updated };
    }),
}));

export default useStore;

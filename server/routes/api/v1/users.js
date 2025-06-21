// server/routes/api/v1/users.js

import express from "express";
import {getUsers,  getMe, deleteAccount } from "../../../controllers/userController.js";
import { protect } from "../../../middleware/auth.js";

const userRoutes = express.Router();

userRoutes.route("/").get(protect, getUsers);

userRoutes.route("/me")
  .get(protect, getMe)
  .delete(protect, deleteAccount);

export default userRoutes;



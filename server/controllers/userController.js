// server/controllers/userController.js

import asyncHandler from "express-async-handler";
import User from "../models/User.js";

export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ _id: { $ne: req.user.id } })
    .select("-password -__v -createdAt -updatedAt")
    .lean();

  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");

  res.status(200).json({
    success: true,
    data: user,
  });
});

export const deleteAccount = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.body.password) {
      return res.status(400).json({
        success: false,
        error: "Password is required",
      });
    }

    const user = await User.findById(userId).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    const isMatch = await user.comparePassword(req.body.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Incorrect password",
      });
    }

    await user.deleteOne();

    res.clearCookie("token");

    res.status(204).end();
  } catch (error) {
    console.error("Account deletion failed:", error);
    res.status(500).json({
      success: false,
      error: "Account deletion failed. Please try again.",
    });
  }
});

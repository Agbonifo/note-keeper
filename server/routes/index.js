//server/routes/index.js

import express from "express";
import apiRoutes from "./api/index.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ 
    status: "API is running",
    documentation: "/api/v1"
  });
});

router.use("/api/v1", apiRoutes);

export default router;





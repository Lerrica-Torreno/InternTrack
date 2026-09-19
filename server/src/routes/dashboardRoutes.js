import express from "express";

import { authenticateUser } from "../middleware/authMiddleware.js";
import { getDashboardStats } from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/", authenticateUser, getDashboardStats);

export default router;
import express from "express";
import { adminLogin } from "../controllers/adminController.js";
import authAdmin from "../middleware/authAdmin.js";

import { getStats, incidentsPerDay } from "../controllers/analyticsController.js";

const router = express.Router();

router.post("/admin/login", adminLogin);

// 🔥 protected
router.get("/admin/analytics/stats", authAdmin, getStats);
router.get("/admin/analytics/incidents", authAdmin, incidentsPerDay);

export default router;
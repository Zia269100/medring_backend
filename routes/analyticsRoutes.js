import express from "express";
import { getStats, incidentsPerDay } from "../controllers/analyticsController.js";

const router = express.Router();

router.get("/analytics/stats", getStats);
router.get("/analytics/incidents", incidentsPerDay);

export default router;
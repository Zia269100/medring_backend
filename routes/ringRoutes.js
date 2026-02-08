import express from "express";
import {
  registerRing,
  getRingData,
  updateMedical,
  createIncident
} from "../controllers/ringController.js";

const router = express.Router();

router.post("/register-ring", registerRing);
router.get("/ring/:token", getRingData);
router.post("/medical/update", updateMedical);
router.post("/incident", createIncident);

export default router;
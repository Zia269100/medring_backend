import express from "express";
import upload from "../middleware/upload.js";
import authDoctor from "../middleware/authDoctor.js";

import {
  registerDoctor,
  doctorLogin
} from "../controllers/doctorController.js";

import { getRingData } from "../controllers/ringController.js";

const router = express.Router();


// register
router.post("/doctor/register", upload.single("proof"), registerDoctor);

// login
router.post("/doctor/login", doctorLogin);


// 🔥 IMPORTANT — protected patient data
router.get("/doctor/patient/:token", authDoctor, getRingData);


export default router;
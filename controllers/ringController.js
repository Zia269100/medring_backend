import User from "../models/User.js";
import Ring from "../models/Ring.js";
import MedicalRecord from "../models/MedicalRecord.js";
import Incident from "../models/Incident.js";

import { generateEmergencyPlan } from "../services/aiEngine.js";
import { sendSMS } from "../services/sms.js";

/* ===================================================
UTILITY
=================================================== */
const cleanToken = (t = "") =>
  String(t).trim().toLowerCase();


/* ===================================================
REGISTER RING
POST /register-ring
=================================================== */
export const registerRing = async (req, res) => {
  try {
    let { token, name, age, bloodGroup, emergencyContact } = req.body;

    token = cleanToken(token);

    if (!token)
      return res.status(400).json({ msg: "Token required" });

    /* 🔥 prevent duplicate token */
    const exists = await Ring.findOne({ token });
    if (exists)
      return res.status(400).json({ msg: "Ring already registered" });

    const user = await User.create({
      name,
      age,
      bloodGroup,
      emergencyContact
    });

    await Ring.create({
      token,
      userId: user._id
    });

    res.json({ message: "Registered successfully" });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};



/* ===================================================
GET RING DATA + AI PLAN
GET /ring/:token?situation=seizure
=================================================== */
export const getRingData = async (req, res) => {
  try {
    const token = cleanToken(req.params.token);
    const { situation = "unknown" } = req.query;

    const ring = await Ring.findOne({ token }).lean();

    if (!ring)
      return res.json({ newUser: true });

    const user = await User.findById(ring.userId).lean();
    const medical = await MedicalRecord.findOne({ userId: user._id }).lean();

    const plan = generateEmergencyPlan(medical || {}, situation);

    res.json({
      user,
      medical,
      plan
    });

  } catch (err) {
    console.error("GET RING ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};



/* ===================================================
UPDATE MEDICAL INFO
POST /medical/update
=================================================== */
export const updateMedical = async (req, res) => {
  try {
    const { userId, conditions, allergies, medications, notes } = req.body;

    const data = await MedicalRecord.findOneAndUpdate(
      { userId },
      { conditions, allergies, medications, notes },
      { upsert: true, new: true }
    );

    res.json(data);

  } catch (err) {
    console.error("MEDICAL UPDATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};



/* ===================================================
CREATE INCIDENT + SMART SMS
POST /incident
=================================================== */
export const createIncident = async (req, res) => {
  try {
    let { token, situation = "unknown", location } = req.body;

    token = cleanToken(token);

    const ring = await Ring.findOne({ token });
    if (!ring)
      return res.status(404).json({ msg: "Ring not found" });

    const user = await User.findById(ring.userId);

    /* save incident */
    const incident = await Incident.create({
      token,
      situation,
      location,
      userId: user._id,
      time: new Date()
    });

    /* 🔥 SMART SMS (safe) */
    if (user?.emergencyContact) {
      try {
        await sendSMS(
          user.emergencyContact,
          `${user.name} is ${situation}.
Immediate help required.
Location: ${location || "unknown"}`
        );
      } catch (smsErr) {
        console.log("SMS failed but continuing:", smsErr.message);
      }
    }

    res.json(incident);

  } catch (err) {
    console.error("INCIDENT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

import User from "../models/User.js";
import Ring from "../models/Ring.js";
import MedicalRecord from "../models/MedicalRecord.js";
import Incident from "../models/Incident.js";

import { generateEmergencyPlan } from "../services/aiEngine.js";
import { sendSMS } from "../services/sms.js";

/* ===================================================
REGISTER RING
=================================================== */
export const registerRing = async (req, res) => {
  try {
    let { token, name, age, bloodGroup, emergencyContact } = req.body;

    token = token.trim().toLowerCase(); // 🔥 FIX

    if (!token)
      return res.status(400).json({ msg: "Token required" });

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
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


/* ===================================================
GET RING DATA + AI PLAN
/ring/:token?situation=seizure
=================================================== */
export const getRingData = async (req, res) => {
  try {
    const { token } = req.params;
    const { situation = "unknown" } = req.query;

    const ring = await Ring.findOne({ token });

    if (!ring)
      return res.json({ newUser: true });

    const user = await User.findById(ring.userId);
    const medical = await MedicalRecord.findOne({ userId: user._id });

    const plan = generateEmergencyPlan(medical || {}, situation);

    res.json({
      user,
      medical,
      plan
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


/* ===================================================
UPDATE MEDICAL INFO
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
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


/* ===================================================
CREATE INCIDENT + SMART SMS
POST /incident
=================================================== */
export const createIncident = async (req, res) => {
  try {
    const { token, situation = "unknown", location } = req.body;

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

    /* 🔥 SMART SMS */
    if (user?.emergencyContact) {
      await sendSMS(
        user.emergencyContact,
        `${user.name} is ${situation}. Immediate help required.\nLocation: ${location || "unknown"}`
      );
    }

    res.json(incident);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


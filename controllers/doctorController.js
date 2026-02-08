import Doctor from "../models/Doctor.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerDoctor = async (req, res) => {
  const { name, email, password, hospital, licenseNumber } = req.body;

  const doc = await Doctor.create({
    name,
    email,
    password,
    hospital,
    licenseNumber,
    proofFile: req.file?.path
  });

  res.json({ message: "Submitted for verification" });
};


export const getPendingDoctors = async (req, res) => {
  const docs = await Doctor.find({ verified: false });
  res.json(docs);
};

export const verifyDoctor = async (req, res) => {
  await Doctor.findByIdAndUpdate(req.params.id, { verified: true });
  res.json({ message: "Approved" });
};

export const doctorLogin = async (req, res) => {
  const { email, password } = req.body;

  const doctor = await Doctor.findOne({ email });

  if (!doctor) return res.status(400).json({ msg: "Not found" });

  const ok = await bcrypt.compare(password, doctor.password);
  if (!ok) return res.status(400).json({ msg: "Wrong password" });

  if (!doctor.verified)
    return res.status(403).json({ msg: "Not verified yet" });

  const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET);

  res.json({ token });
};
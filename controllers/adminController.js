import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const adminLogin = async (req, res) => {

  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });

  if (!admin) return res.status(400).json({ msg: "Not found" });

  const ok = await bcrypt.compare(password, admin.password);

  if (!ok) return res.status(400).json({ msg: "Wrong password" });

  const token = jwt.sign(
    { id: admin._id, role: "admin" },
    process.env.JWT_SECRET
  );

  res.json({ token });
};
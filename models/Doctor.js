import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const doctorSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,

  hospital: String,
  licenseNumber: String,

  proofFile: String, // pdf/image path
  verified: { type: Boolean, default: false }
});

doctorSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

export default mongoose.model("Doctor", doctorSchema);
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
  bloodGroup: String,
  emergencyContact: String,
  role: { type: String, default: "owner" }
});

export default mongoose.model("User", userSchema);
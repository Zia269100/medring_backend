import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema({
  email: String,
  password: String
});

adminSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 10);
});

export default mongoose.model("Admin", adminSchema);
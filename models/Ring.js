import mongoose from "mongoose";

const ringSchema = new mongoose.Schema({
  token: { type: String, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

export default mongoose.model("Ring", ringSchema);
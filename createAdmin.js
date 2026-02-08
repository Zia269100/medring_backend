import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "./models/Admin.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {

    await Admin.create({
      email: "Mysterio&Mhate@medring.com",
      password: "hunnu_the_goat"
    });

    console.log("✅ Admin created");

    process.exit();
  });
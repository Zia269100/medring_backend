import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import ringRoutes from "./routes/ringRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", analyticsRoutes);
app.use("/api", adminRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"));

app.use("/api", ringRoutes);
app.use("/api", doctorRoutes);

app.listen(process.env.PORT, () =>
  console.log(`Server running on ${process.env.PORT}`)
);
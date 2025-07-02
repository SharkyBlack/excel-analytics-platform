import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();
const mongoURI = process.env.MONGO_URI;
const jwtSecret = process.env.JWT_SECRET;

const app = express();
app.use(express.json());
app.use(cors());

//routes
app.use("/api/auth", authRoutes);

//db connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MOngoDB connected"))
  .catch((err) => console.log(err));

app.get("/api", (req, res) => {
  res.send("Apii running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));

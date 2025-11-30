import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

const app = express();

app.use(cors({
  origin: ["http://localhost:3000", "https://ignite-x-five.vercel.app"],
  credentials: true,
}));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", contactRoutes);

app.listen(4000, () => console.log(`Server running on http://localhost:4000`));

import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import onboardingRoutes from "./routes/onboardingRoutes.js";
import planRoutes from "./routes/planRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";

const app = express();

app.use(cors({
  origin: ["http://localhost:3000", "https://ignite-x-five.vercel.app"],
  credentials: true,
}));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", contactRoutes);
app.use("/api/onboarding", onboardingRoutes);
app.use("/api", planRoutes);
app.use("/api/resume", resumeRoutes);
app.listen(4000, () => console.log(`Server running on http://localhost:4000`));

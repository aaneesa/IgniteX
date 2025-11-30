import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  updateOnboarding,
  getOnboardingStatus,
} from "../controllers/onboardingController.js";

const router = express.Router();

router.post("/update", authMiddleware, updateOnboarding);
router.get("/status", authMiddleware, getOnboardingStatus);

export default router;

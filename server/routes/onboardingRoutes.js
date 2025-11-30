import express from "express";
import { authenticate } from "../middleware/auth.js";
import {
  updateOnboarding,
  getOnboardingStatus,
} from "../controllers/onboardingController.js";

const router = express.Router();

router.post("/update", authenticate, updateOnboarding);
router.get("/status", authenticate, getOnboardingStatus);

export default router;

import express from "express";
import { getLearningPlanController } from "../controllers/planController.js";
import { authenticate} from "../middleware/auth.js";

const router = express.Router();

router.get("/learning-plan", authenticate, getLearningPlanController);

export default router;

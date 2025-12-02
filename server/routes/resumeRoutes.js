import express from "express";
import {
  createResumeController,
  getResumeController,      
  updateResumeController,
  deleteResumeController,
  improveResumeController
} from "../controllers/resumeController.js";

import { authenticate } from "../middleware/auth.js";

const router = express.Router();
router.use(authenticate);
router.post("/", createResumeController);
router.get("/", getResumeController); 
router.put("/", updateResumeController); 
router.delete("/", deleteResumeController); 
router.post("/improve", improveResumeController);

export default router;

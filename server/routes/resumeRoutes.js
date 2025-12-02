import express from "express";
import {
  createOrUpdateResumeController,
  getResumeController,      
  deleteResumeController,
  improveResumeController
} from "../controllers/resumeController.js";

import { authenticate } from "../middleware/auth.js";

const router = express.Router();
router.use(authenticate);
router.post("/", createOrUpdateResumeControllerr);
router.get("/", getResumeController); 
router.put("/", createOrUpdateResumeController); 
router.delete("/", deleteResumeController); 
router.post("/improve", improveResumeController);

export default router;

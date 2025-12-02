import express from "express";
import {
  createAssessmentController,
  getAssessmentsController,
  getAssessmentByIdController,
  updateAssessmentController,
  deleteAssessmentController,
  attemptAssessmentController
} from "../controllers/assessmentController.js";

import { authenticate } from "../middleware/auth.js";

const router = express.Router();
router.use(authenticate);

router.post("/", createAssessmentController);           
router.get("/", getAssessmentsController);               
router.get("/:id", getAssessmentByIdController);        
router.put("/:id", updateAssessmentController);          
router.delete("/:id", deleteAssessmentController);       
router.post("/:id/attempt", attemptAssessmentController);

export default router;

import express from "express";
import {
  createResumeController,
  getAllResumesController,
  getResumeController,
  updateResumeController,
  deleteResumeController,
  improveResumeController
} from "../controllers/resumeController.js";

import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticate);

router.post("/", createResumeController);
router.get("/", getAllResumesController);
router.get("/:id", getResumeController);
router.put("/:id", updateResumeController);
router.delete("/:id", deleteResumeController);

router.post("/improve", improveResumeController);

export default router;

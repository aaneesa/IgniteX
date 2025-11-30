import express from "express";
import { signup, login } from "../controllers/authController.js";
import { validateUser } from "../middleware/validate.js";

const router = express.Router();

router.post("/signup", validateUser, signup);
router.post("/login", validateUser, login);

export default router;

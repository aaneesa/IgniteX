import express from "express";
import { submitContact } from "../controllers/contactController.js";
import { validateContact } from "../middleware/validateContact.js";

const router = express.Router();

router.post("/contact", validateContact, submitContact);

export default router;

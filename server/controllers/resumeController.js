import * as resumeService from "../services/resumeService.js";

// Create a resume
export const createResumeController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { content } = req.body;

    const resume = await resumeService.createResume(userId, content);

    res.status(201).json({ success: true, resume });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get all resumes (with pagination/search)
export const getAllResumesController = async (req, res) => {
  try {
    const data = await resumeService.getAllResumes(req.query);
    res.json({ success: true, ...data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get a single resume by ID
export const getResumeController = async (req, res) => {
  try {
    const resumeId = req.params.id.toString(); // ✅ convert to string
    const resume = await resumeService.getResumeById(resumeId);
    res.json({ success: true, resume });
  } catch (err) {
    res.status(404).json({ success: false, error: err.message });
  }
};

// Update a resume by ID
export const updateResumeController = async (req, res) => {
  try {
    const resumeId = req.params.id.toString();
    const { content } = req.body;

    const updated = await resumeService.updateResume(resumeId, content);
    res.json({ success: true, resume: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Delete a resume by ID
export const deleteResumeController = async (req, res) => {
  try {
    const resumeId = req.params.id.toString();
    await resumeService.deleteResume(resumeId);
    res.json({ success: true, message: "Resume deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Improve resume using AI
export const improveResumeController = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ fixed
    const { current, type } = req.body;

    const improved = await resumeService.improveResumeAI(userId, current, type);
    res.json({ success: true, improved });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

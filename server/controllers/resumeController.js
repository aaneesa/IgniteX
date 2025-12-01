import * as resumeService from "../services/resumeService.js";

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

export const getAllResumesController = async (req, res) => {
  try {
    const data = await resumeService.getAllResumes(req.query);
    res.json({ success: true, ...data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getResumeController = async (req, res) => {
  try {
    const resume = await resumeService.getResumeById(req.params.id);
    res.json({ success: true, resume });
  } catch (err) {
    res.status(404).json({ success: false, error: err.message });
  }
};

export const updateResumeController = async (req, res) => {
  try {
    const updated = await resumeService.updateResume(req.params.id, req.body.content);
    res.json({ success: true, resume: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const deleteResumeController = async (req, res) => {
  try {
    await resumeService.deleteResume(req.params.id);
    res.json({ success: true, message: "Resume deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const improveResumeController = async (req, res) => {
  try {
    const { userId } = req;
    const { current, type } = req.body;

    const improved = await resumeService.improveResumeAI(userId, current, type);
    res.json({ success: true, improved });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

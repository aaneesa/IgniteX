import * as resumeService from "../services/resumeService.js";
export const getResumeController = async (req, res) => {
  try {
    const resume = await resumeService.getResumeByUserId(req.user.id);
    res.json({ success: true, resume });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
export const createResumeController = async (req, res) => {
  try {
    const resume = await resumeService.createResume(req.user.id, req.body.content);
    res.status(201).json({ success: true, resume });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
export const updateResumeController = async (req, res) => {
  try {
    const resume = await resumeService.updateResumeByUserId(req.user.id, req.body.content);
    res.json({ success: true, resume });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
export const deleteResumeController = async (req, res) => {
  try {
    await resumeService.deleteResumeByUserId(req.user.id);
    res.json({ success: true, message: "Resume deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
export const improveResumeController = async (req, res) => {
  try {
    const { current, type } = req.body;
    const improved = await resumeService.improveResumeAI(req.user.id, current, type);
    res.json({ success: true, improved });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

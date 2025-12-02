import * as resumeService from "../services/resumeService.js";

export const getResumeController = async (req, res) => {
  try {
    const userId = req.user.id;
    const resume = await resumeService.getResumeByUserId(userId);

    res.json({ success: true, resume }); 
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
export const createOrUpdateResumeController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { content } = req.body;

    const existing = await resumeService.getResumeByUserId(userId);

    let resume;
    if (existing) {
      resume = await resumeService.updateResumeByUserId(userId, content);
    } else {
      resume = await resumeService.createResume(userId, content);
    }

    res.json({ success: true, resume });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
export const deleteResumeController = async (req, res) => {
  try {
    const userId = req.user.id;
    await resumeService.deleteResumeByUserId(userId);
    res.json({ success: true, message: "Resume deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
export const improveResumeController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { current, type } = req.body;

    const improved = await resumeService.improveResumeAI(userId, current, type);
    res.json({ success: true, improved });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

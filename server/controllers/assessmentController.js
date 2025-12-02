import * as service from "../services/assessmentService.js";

export const createAssessmentController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { category } = req.body;
    if (!category) return res.status(400).json({ success: false, error: "category required" });

    const assessment = await service.createAssessment(userId, category);
    res.status(201).json({ success: true, assessment });
  } catch (err) {
    console.error("createAssessmentController:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getAssessmentsController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page, limit, search, category, sort, order } = req.query;
    const data = await service.getAssessments(userId, { page, limit, search, category, sort, order });
    res.json({ success: true, ...data });
  } catch (err) {
    console.error("getAssessmentsController:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getAssessmentByIdController = async (req, res) => {
  try {
    const assessment = await service.getAssessmentById(req.params.id);
    res.json({ success: true, assessment });
  } catch (err) {
    res.status(404).json({ success: false, error: err.message });
  }
};

export const updateAssessmentController = async (req, res) => {
  try {
    const updated = await service.updateAssessment(req.params.id, req.body);
    res.json({ success: true, updated });
  } catch (err) {
    console.error("updateAssessmentController:", err);
    res.status(400).json({ success: false, error: err.message });
  }
};

export const deleteAssessmentController = async (req, res) => {
  try {
    await service.deleteAssessment(req.params.id);
    res.json({ success: true, message: "Assessment deleted" });
  } catch (err) {
    console.error("deleteAssessmentController:", err);
    res.status(400).json({ success: false, error: err.message });
  }
};

export const attemptAssessmentController = async (req, res) => {
  try {
    const { answers } = req.body; 
    if (!Array.isArray(answers)) return res.status(400).json({ success: false, error: "answers array required" });

    const result = await service.attemptAssessment(req.params.id, answers);
    res.json({ success: true, result });
  } catch (err) {
    console.error("attemptAssessmentController:", err);
    res.status(400).json({ success: false, error: err.message });
  }
};

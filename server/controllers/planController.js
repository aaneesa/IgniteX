import { fetchOrGeneratePlan } from "../services/planService.js";

export const getLearningPlanController = async (req, res) => {
  try {
    const userId = req.user.id;
    const plan = await fetchOrGeneratePlan(userId);

    return res.status(200).json({
      success: true,
      plan,
    });
  } catch (error) {
    console.error("LearningPlan controller error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Something went wrong",
    });
  }
};

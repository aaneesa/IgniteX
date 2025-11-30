import {
  updateOnboardingService,
  getOnboardingStatusService,
} from "../services/onboardingService.js";

export const updateOnboarding = async (req, res) => {
  try {
    const userId = req.userId; // from middleware
    const data = req.body;

    const updatedUser = await updateOnboardingService(userId, data);

    res.json({
      message: "Onboarding updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getOnboardingStatus = async (req, res) => {
  try {
    const userId = req.userId;

    const status = await getOnboardingStatusService(userId);

    res.json(status);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

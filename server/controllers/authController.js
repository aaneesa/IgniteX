import { registerUser, loginUser } from "../services/authService.js";

export const signup = async (req, res) => {
  try {
    const { user, token } = await registerUser(req.body);

    res.status(201).json({
      message: "Signup successful",
      token,
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(400).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { user, token } = await loginUser(req.body);

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(400).json({ message: err.message });
  }
};

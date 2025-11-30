export const validateUser = (req, res, next) => {
  const { username, email, password } = req.body;
  const path = req.path.toLowerCase();
  if (path === "/signup") {
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }
  }
  if (path === "/login") {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
  }
  next();
};

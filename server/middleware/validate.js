export const validateUser = (req, res, next) => {
  const { username, email, password } = req.body;

  if (req.path === "/signup") {
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }
  }

  if (req.path === "/login") {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
  }

  next();
};

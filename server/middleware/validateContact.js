export function validateContact(req, res, next) {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      error: "All fields (name, email, message) are required.",
    });
  }
  next();
}

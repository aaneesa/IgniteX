import { verifyToken } from "../jwt.js";

export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token missing." });
    }
    const decoded = verifyToken(token); 
    if (!decoded) {
      return res.status(403).json({ message: "Invalid or expired token." });
    }
    req.user = decoded; 
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(500).json({ message: "Internal server error in authentication." });
  }
};

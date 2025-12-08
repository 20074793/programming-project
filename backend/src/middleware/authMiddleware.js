// backend/src/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

// Verify JWT and attach user to req.user
exports.requireAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.id,
      role: decoded.role,
      email: decoded.email,
    };

    next();
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }

// Ensure current user has approver role
exports.requireApprover = (req, res, next) => {
  if (!req.user || req.user.role !== "approver") {
    return res.status(403).json({ message: "Approver role required" });
  }
  next();
};

};

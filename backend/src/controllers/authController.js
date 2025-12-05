// backend/src/controllers/authController.js

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Helper: create JWT token for a user
function generateToken(user) {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// POST /api/auth/register
exports.register = async (req, res) => {
  // TODO: implement register logic
  res.status(501).json({ message: "register not implemented yet" });
};

// POST /api/auth/login
exports.login = async (req, res) => {
  // TODO: implement login logic
  res.status(501).json({ message: "login not implemented yet" });
};

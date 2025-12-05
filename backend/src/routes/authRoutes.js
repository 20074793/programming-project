// backend/src/routes/authRoutes.js
const express = require("express");
const { register, login, getMe } = require("../controllers/authController");

const router = express.Router();

// POST /api/auth/register
router.post("/register", register);

// POST /api/auth/login
router.post("/login", login);

// (optional) GET /api/auth/me – we'll protect this later with middleware
router.get("/me", getMe);

module.exports = router;

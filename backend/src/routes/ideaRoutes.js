const express = require("express");
const router = express.Router();

const {
  createIdea,
  getIdeas,
  getIdeaById,
  updateIdea,
  deleteIdea,
  updateStatus,
  likeIdea,
  addComment,

} = require("../controllers/ideaController.js");

const { requireAuth, requireApprover } = require("../middleware/authMiddleware");

// Public: anyone can view all ideas
router.get("/", getIdeas);
// Public: anyone can view single idea
router.get("/:id", getIdeaById);
// Logged-in users only
router.post("/", requireAuth, createIdea);               // create idea
router.put("/:id", requireAuth, updateIdea);             // update idea
router.post("/:id/like", requireAuth, likeIdea);         // like idea
router.post("/:id/comments", requireAuth, addComment);   // add comment to idea
// Approver-only actions
router.delete("/:id", requireAuth, requireApprover, deleteIdea);  
router.patch("/:id/status", requireAuth, requireApprover, updateStatus);


module.exports = router;

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
} = require("../controllers/ideaController.js");


// /api/ideas
router.post("/", createIdea);            // create idea
router.get("/", getIdeas);               // list all ideas
router.get("/:id", getIdeaById);         // get one idea
router.put("/:id", updateIdea);          // update idea
router.delete("/:id", deleteIdea);       // delete idea
router.patch("/:id/status", updateStatus); // update status

module.exports = router;

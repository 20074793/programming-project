const express = require("express");
const router = express.Router();
const ideaController = require("../controllers/ideaController");

// /api/ideas
router.post("/", ideaController.createIdea);      // create idea
router.get("/", ideaController.getIdeas);        // list all ideas
router.get("/:id", ideaController.getIdeaById);  // get one idea
router.put("/:id", ideaController.updateIdea);   // update idea
router.delete("/:id", ideaController.deleteIdea);// delete idea

module.exports = router;

const Idea = require("../models/Idea");

// Create idea
exports.createIdea = async (req, res) => {
  try {
    const { title, description, department, submittedBy, allowAnonymous } =
      req.body;

    const idea = await Idea.create({
      title,
      description,
      department,
      submittedBy,
      allowAnonymous,
    });

    res.status(201).json(idea);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating idea" });
  }
};

// Get all ideas
exports.getIdeas = async (req, res) => {
  try {
    const ideas = await Idea.find().sort({ createdAt: -1 });
    res.json(ideas);
  } catch (err) {
    res.status(500).json({ message: "Error fetching ideas" });
  }
};

// Get single idea
exports.getIdeaById = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).json({ message: "Idea not found" });
    res.json(idea);
  } catch (err) {
    res.status(500).json({ message: "Error fetching idea" });
  }
};

// Update idea
exports.updateIdea = async (req, res) => {
  try {
    const updated = await Idea.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Idea not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating idea" });
  }
};

// Delete idea
exports.deleteIdea = async (req, res) => {
  try {
    const deleted = await Idea.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Idea not found" });
    res.json({ message: "Idea deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting idea" });
  }
};

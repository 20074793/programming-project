const Idea = require("../models/Idea");

// Create idea
exports.createIdea = async (req, res) => {
  try {
    const { title, description, department, submittedBy, allowAnonymous } = req.body;

    // basic validation
    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required." });
    }

    if (!allowAnonymous && !submittedBy) {
      return res.status(400).json({ message: "Please enter your name or choose anonymous." });
    }

    // create idea
    const idea = await Idea.create({
      title,
      description,
      department,
      submittedBy,
      allowAnonymous,
    });

    res.status(201).json(idea);

  } catch (err) {
    console.error("Create idea error:", err);
    res.status(500).json({ message: "Could not create idea" });
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
    const id = req.params.id;

    // validate MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const idea = await Idea.findById(id);
    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }

    res.json(idea);

  } catch (err) {
    console.error("Error fetching idea:", err);
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
// Update idea status
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const updatedIdea = await Idea.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedIdea) {
      return res.status(404).json({ message: "Idea not found" });
    }

    res.json(updatedIdea);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating status" });
  }

};
// Increment likes count for an idea
exports.likeIdea = async (req, res) => {
  try {
    const { id } = req.params;

    const idea = await Idea.findByIdAndUpdate(
      id,
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }

    res.json(idea);
  } catch (err) {
    console.error("Error liking idea:", err);
    res.status(500).json({ message: "Error liking idea" });
  }
};

// Add a new comment to an idea
exports.addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { author, text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const idea = await Idea.findById(id);
    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }

    idea.comments.push({
      author: author && author.trim() !== "" ? author : "Anonymous",
      text,
    });

    await idea.save();

    res.status(201).json(idea);
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ message: "Error adding comment" });
  }
};




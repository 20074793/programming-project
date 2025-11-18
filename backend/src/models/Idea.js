const mongoose = require("mongoose");

const ideaSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      default: "General",
    },
    status: {
      type: String,
      enum: [
        "submitted",
        "in_review",
        "approved",
        "in_progress",
        "implemented",
        "rejected",
      ],
      default: "submitted",
    },
    submittedBy: {
      type: String, // later we can change this to userId when we add auth
      required: true,
    },
    allowAnonymous: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Idea", ideaSchema);

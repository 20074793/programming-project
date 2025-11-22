const mongoose = require("mongoose");

const ideaSchema = new mongoose.Schema(
   {
    title: {
      type: String,
      required: true,
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
      type: String,
      required: true, // later can be changed to userId
    },
    allowAnonymous: {
      type: Boolean,
      default: false,
    },

    likes: {
      type: Number,
      default: 0,
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model("Idea", ideaSchema);

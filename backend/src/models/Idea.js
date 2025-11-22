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
      default: 0,     // Number of upvotes an idea has received
    },

    // Simple embedded comments for each idea
    comments: [
      {
        author: {
          type: String,
          default: "Anonymous",
        },
        text: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

  },
  { timestamps: true }
);

module.exports = mongoose.model("Idea", ideaSchema);

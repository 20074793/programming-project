import React, { useEffect, useState } from "react";
import {
  getIdeas,
  deleteIdea,
  updateIdeaStatus,
  likeIdea,
  addComment, // 👈 make sure this exists in api.js
} from "./api";

// All allowed status values
const STATUS_OPTIONS = [
  "submitted",
  "in_review",
  "approved",
  "in_progress",
  "implemented",
  "rejected",
];

function IdeaList({ refreshToken }) {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [commentInputs, setCommentInputs] = useState({}); // { ideaId: "text" }

  const loadIdeas = async () => {
    try {
      setLoading(true);
      const data = await getIdeas();
      setIdeas(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load ideas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIdeas();
  }, [refreshToken]); // reload when parent changes refreshToken

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this idea?")) return;
    try {
      await deleteIdea(id);
      setIdeas((prev) => prev.filter((idea) => idea._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete idea.");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const updated = await updateIdeaStatus(id, newStatus);
      setIdeas((prev) =>
        prev.map((idea) => (idea._id === id ? updated : idea))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update status.");
    }
  };

  const handleLike = async (id) => {
    try {
      const updated = await likeIdea(id);
      setIdeas((prev) =>
        prev.map((idea) => (idea._id === id ? updated : idea))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to like idea.");
    }
  };

  const handleCommentChange = (id, value) => {
    setCommentInputs((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleAddComment = async (id) => {
    const text = (commentInputs[id] || "").trim();
    if (!text) {
      alert("Please enter a comment before submitting.");
      return;
    }

    try {
      // backend will add createdAt, maybe author later
      const updated = await addComment(id, { text });
      setIdeas((prev) =>
        prev.map((idea) => (idea._id === id ? updated : idea))
      );
      // clear input
      setCommentInputs((prev) => ({
        ...prev,
        [id]: "",
      }));
    } catch (err) {
      console.error(err);
      alert("Failed to add comment.");
    }
  };

  if (loading) return <p style={styles.center}>Loading ideas...</p>;
  if (error) return <p style={styles.center}>{error}</p>;
  if (ideas.length === 0) return <p style={styles.center}>No ideas yet.</p>;

  return (
    <div style={styles.list}>
      {ideas.map((idea) => (
        <div key={idea._id} style={styles.card}>
          <h3>{idea.title}</h3>
          <p>{idea.description}</p>

          <p style={styles.meta}>
            Department: <strong>{idea.department}</strong>
          </p>

          <p style={styles.meta}>
            Submitted by:{" "}
            <strong>
              {idea.allowAnonymous ? "Anonymous" : idea.submittedBy}
            </strong>
          </p>

          <p style={styles.meta}>
            Likes: <strong>{idea.likes ?? 0}</strong>
          </p>

          <p style={styles.meta}>
            Comments:{" "}
            <strong>
              {Array.isArray(idea.comments) ? idea.comments.length : 0}
            </strong>
          </p>

          {/* Existing comments list */}
          {idea.comments && idea.comments.length > 0 && (
            <div style={styles.commentsBox}>
              {idea.comments.map((comment, index) => (
                <div key={index} style={styles.commentItem}>
                  <p style={styles.commentAuthor}>
                    {comment.author || "Anonymous"}:
                  </p>
                  <p style={styles.commentText}>{comment.text}</p>
                  <p style={styles.commentDate}>
                    {comment.createdAt
                      ? new Date(comment.createdAt).toLocaleString()
                      : ""}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Status dropdown */}
          <div style={styles.statusRow}>
            <span style={styles.meta}>
              Status: <strong>{idea.status}</strong>
            </span>

            <select
              value={idea.status}
              onChange={(e) => handleStatusChange(idea._id, e.target.value)}
              style={styles.select}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Comment input */}
          <div style={styles.commentForm}>
            <input
              type="text"
              placeholder="Add a comment…"
              value={commentInputs[idea._id] || ""}
              onChange={(e) =>
                handleCommentChange(idea._id, e.target.value)
              }
              style={styles.commentInput}
            />
            <button
              onClick={() => handleAddComment(idea._id)}
              style={styles.commentButton}
            >
              Comment
            </button>
          </div>

          {/* Action buttons */}
          <div style={styles.actionsRow}>
            <button
              onClick={() => handleLike(idea._id)}
              style={styles.like}
            >
              👍 Like
            </button>

            <button
              onClick={() => handleDelete(idea._id)}
              style={styles.delete}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  list: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 16,
    padding: 20,
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: 8,
    padding: 16,
    backgroundColor: "white",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  },
  meta: {
    fontSize: 14,
    color: "#555",
  },
  statusRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    gap: 8,
  },
  select: {
    padding: 4,
    borderRadius: 4,
    border: "1px solid #ccc",
    fontSize: 14,
  },
  actionsRow: {
    display: "flex",
    gap: 8,
    marginTop: 8,
  },
  delete: {
    padding: "6px 10px",
    borderRadius: 4,
    border: "none",
    backgroundColor: "#dc2626",
    color: "white",
    cursor: "pointer",
  },
  like: {
    padding: "6px 10px",
    borderRadius: 4,
    border: "none",
    backgroundColor: "#2563eb",
    color: "white",
    cursor: "pointer",
  },
  center: {
    textAlign: "center",
    marginTop: 20,
  },
  commentsBox: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#f9fafb",
    borderRadius: 6,
    border: "1px solid #eee",
  },
  commentItem: {
    marginBottom: 8,
    paddingBottom: 8,
    borderBottom: "1px solid #ddd",
  },
  commentAuthor: {
    fontWeight: "bold",
    fontSize: 14,
  },
  commentText: {
    fontSize: 14,
    color: "#333",
    marginTop: 2,
  },
  commentDate: {
    fontSize: 12,
    color: "#777",
    marginTop: 4,
  },
  commentForm: {
    display: "flex",
    gap: 8,
    marginTop: 10,
  },
  commentInput: {
    flex: 1,
    padding: 6,
    borderRadius: 4,
    border: "1px solid #ccc",
    fontSize: 14,
  },
  commentButton: {
    padding: "6px 12px",
    borderRadius: 4,
    border: "none",
    backgroundColor: "#16a34a",
    color: "white",
    cursor: "pointer",
  },
};

export default IdeaList;

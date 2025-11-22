import React, { useEffect, useState } from "react";
import { getIdeas, deleteIdea, updateIdeaStatus } from "./api";

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

          <div style={styles.statusRow}>
            <span style={styles.meta}>
              Status: <strong>{idea.status}</strong>
            </span>

            <select
              value={idea.status}
              onChange={(e) =>
                handleStatusChange(idea._id, e.target.value)
              }
              style={styles.select}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => handleDelete(idea._id)}
            style={styles.delete}
          >
            Delete
          </button>
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
  delete: {
    marginTop: 8,
    padding: "6px 10px",
    borderRadius: 4,
    border: "none",
    backgroundColor: "#dc2626",
    color: "white",
    cursor: "pointer",
  },
  center: {
    textAlign: "center",
    marginTop: 20,
  },
};

export default IdeaList;

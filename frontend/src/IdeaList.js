import React, { useEffect, useState } from "react";
import { getIdeas, deleteIdea, updateIdeaStatus } from "./api";

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

const STATUS_OPTIONS = [
  "submitted",
  "in_review",
  "approved",
  "in_progress",
  "implemented",
  "rejected",
];

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
            Status: <strong>{idea.status}</strong>
          </p>
          <button onClick={() => handleDelete(idea._id)} style={styles.delete}>
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

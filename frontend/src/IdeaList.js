import React, { useEffect, useState } from "react";
import { 
  getIdeas, 
  deleteIdea, 
  updateIdeaStatus, 
  likeIdea 
} from "./api";

// Status dropdown options
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
  const [sortOption, setSortOption] = useState("newest");
  const [searchTerm, setSearchTerm] = useState("");


  // Load ideas
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
  }, [refreshToken]);

  // Delete idea
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

  // Status change
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

  // Likes
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
  // === DASHBOARD ANALYTICS ===
  const totalIdeas = ideas.length;

  const totalLikes = ideas.reduce(
    (sum, idea) => sum + (idea.likes || 0),
    0
  );

  const statusCounts = ideas.reduce((acc, idea) => {
    const key = idea.status || "unknown";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  // SORT LOGIC
  
  // Filter ideas based on search term
  const filteredIdeas = ideas.filter((idea) => {
    if (!searchTerm.trim()) return true;

    const term = searchTerm.toLowerCase();

    return (
      idea.title.toLowerCase().includes(term) ||
      idea.description.toLowerCase().includes(term) ||
      (idea.department || "").toLowerCase().includes(term) ||
      (idea.submittedBy || "").toLowerCase().includes(term)
    );
  });

  // Then sort the filtered ideas
  const sortedIdeas = [...filteredIdeas].sort((a, b) => {
    if (sortOption === "likes") {
      return (b.likes || 0) - (a.likes || 0);
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

    // newest first
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  if (loading) return <p style={styles.center}>Loading ideas...</p>;
  if (error) return <p style={styles.center}>{error}</p>;
  if (ideas.length === 0) return <p style={styles.center}>No ideas yet.</p>;

  return (

    
    <div>

      <div style={styles.analyticsWrapper}>
        <div style={styles.analyticsCard}>
          <h4 style={styles.analyticsTitle}>Total Ideas</h4>
          <p style={styles.analyticsNumber}>{totalIdeas}</p>
        </div>

        <div style={styles.analyticsCard}>
          <h4 style={styles.analyticsTitle}>Total Likes</h4>
          <p style={styles.analyticsNumber}>{totalLikes}</p>
        </div>

        <div style={styles.analyticsCard}>
          <h4 style={styles.analyticsTitle}>By Status</h4>
          {Object.entries(statusCounts).map(([status, count]) => (
            <div style={styles.analyticsRow} key={status}>
              <span>{status}</span>
              <span>{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SORT BAR */}

      <div style={styles.toolbar}>
        <input
          type="text"
          placeholder="Search ideas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />

        <span style={styles.meta}>Sort by: </span>

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          style={styles.select}
        >
          <option value="newest">Newest first</option>
          <option value="likes">Most liked</option>
        </select>
      </div>


      {/* IDEA LIST */}
      <div style={styles.list}>
        {sortedIdeas.map((idea) => (
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

            {/* COMMENTS DISPLAY */}
            {idea.comments && idea.comments.length > 0 && (
              <div style={styles.commentsBox}>
                {idea.comments.map((comment, index) => (
                  <div key={index} style={styles.commentItem}>
                    <p style={styles.commentAuthor}>
                      {comment.author || "Anonymous"}:
                    </p>
                    <p style={styles.commentText}>{comment.text}</p>
                    <p style={styles.commentDate}>
                      {new Date(comment.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* STATUS + ACTIONS */}
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

            <button
              onClick={() => handleDelete(idea._id)}
              style={styles.delete}
            >
              Delete
            </button>

            <button
              onClick={() => handleLike(idea._id)}
              style={styles.like}
            >
              👍 Like
            </button>
          </div>
        ))}
      </div>
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
  select: {
    padding: 4,
    borderRadius: 4,
    border: "1px solid #ccc",
    fontSize: 14,
  },
  statusRow: {
    marginTop: 10,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
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
  like: {
    marginTop: 8,
    padding: "6px 10px",
    borderRadius: 4,
    border: "none",
    backgroundColor: "#2563eb",
    color: "white",
    cursor: "pointer",
    marginLeft: 8,
  },
  center: {
    textAlign: "center",
    marginTop: 20,
  },
  toolbar: {
    padding: 10,
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "#f5f5f5",
    borderRadius: 6,
    margin: "10px 20px",
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
    marginTop: 2,
  },
  commentDate: {
    fontSize: 12,
    color: "#777",
    marginTop: 4,
  },

    analyticsWrapper: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: 12,
    padding: "10px 20px",
    marginTop: 10,
  },
  analyticsCard: {
    background: "#111827",
    color: "white",
    padding: 12,
    borderRadius: 8,
    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
  },
  analyticsTitle: {
    fontSize: 14,
    marginBottom: 4,
    opacity: 0.9,
  },
  analyticsNumber: {
    fontSize: 22,
    fontWeight: "bold",
  },
  analyticsRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 13,
    marginTop: 2,
  },
    searchInput: {
    flex: 1,
    padding: 6,
    borderRadius: 4,
    border: "1px solid #ccc",
    fontSize: 14,
  },


};

export default IdeaList;

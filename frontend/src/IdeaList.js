import React, { useEffect, useState } from "react";
import { 
  getIdeas, 
  deleteIdea, 
  updateIdeaStatus, 
  likeIdea,
  updateIdea,
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

function IdeaList({ refreshToken, currentUser }) {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    department: "",
  });



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

  //
  const handleSaveEdit = async () => {
    if (!editingId) return;

    try {
      const updated = await updateIdea(editingId, {
        title: editForm.title,
        description: editForm.description,
        department: editForm.department,
      });

      setIdeas((prev) =>
        prev.map((idea) => (idea._id === editingId ? updated : idea))
      );

      setEditingId(null);
      setEditForm({ title: "", description: "", department: "" });
    } catch (err) {
      console.error("Failed to update idea:", err);
      alert("Failed to save changes.");
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

    const startEdit = (idea) => {
    setEditingId(idea._id);
    setEditForm({
      title: idea.title || "",
      description: idea.description || "",
      department: idea.department || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ title: "", description: "", department: "" });
  };

  const handleEditChange = (field, value) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
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

   // Filter ideas based on search term and status

   const departmentOptions = Array.from(
    new Set(ideas.map((idea) => idea.department).filter(Boolean))
  );
  const filteredIdeas = ideas.filter((idea) => {
    // Status filter
    if (filterStatus !== "all" && idea.status !== filterStatus) {
      return false;
    }
// Department filter
if (filterDepartment !== "all" && idea.department !== filterDepartment) {
  return false;
}

    // Search filter
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

      <div style={styles.toolbar}>
        <input
          type="text"
          placeholder="Search ideas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />

        <span style={styles.meta}>Department:</span>
        <select
          value={filterDepartment}
          onChange={(e) => setFilterDepartment(e.target.value)}
          style={styles.select}
        >
          <option value="all">All</option>
          {departmentOptions.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>

        <span style={styles.meta}>Status:</span>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={styles.select}
        >
          <option value="all">All</option>
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status.replace("_", " ")}
            </option>
          ))}
        </select>

        <span style={styles.meta}>Sort by:</span>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          style={styles.select}
        >
          <option value="newest">Newest first</option>
          <option value="likes">Most liked</option>
        </select>
      </div>

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
          {editingId === idea._id ? (
            <>
              <input
                type="text"
                value={editForm.title}
                onChange={(e) => handleEditChange("title", e.target.value)}
                style={styles.input}
                placeholder="Title"
              />
              <textarea
                value={editForm.description}
                onChange={(e) =>
                  handleEditChange("description", e.target.value)
                }
                style={styles.textarea}
                placeholder="Description"
              />
              <input
                type="text"
                value={editForm.department}
                onChange={(e) =>
                  handleEditChange("department", e.target.value)
                }
                style={styles.input}
                placeholder="Department"
              />
            </>
          ) : (
            <>
              <h3>{idea.title}</h3>
              <p>{idea.description}</p>
              <p style={styles.meta}>
                Department: <strong>{idea.department}</strong>
              </p>
            </>
          )}

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

               {currentUser?.role === "approver" && (
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
                 )}
              </div>

            <div style={styles.actionsRow}>
              <button
                onClick={() => handleLike(idea._id)}
                style={styles.like}
              >
                👍 Like
              </button>

              {editingId === idea._id ? (
                <>
                  <button onClick={handleSaveEdit} style={styles.save}>
                    Save
                  </button>
                  <button onClick={cancelEdit} style={styles.cancel}>
                    Cancel
                  </button>
                </>
              ) : (
                <button onClick={() => startEdit(idea)} style={styles.edit}>
                  Edit
                </button>
              )}


              {currentUser?.role === "approver" && (
             <button
              onClick={() => handleDelete(idea._id)}
               style={styles.delete}
               >
                Delete
             </button>
)}

            </div>

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
  actionsRow: {
    marginTop: 8,
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
  },
  edit: {
    padding: "6px 10px",
    borderRadius: 4,
    border: "none",
    backgroundColor: "#f59e0b",
    color: "white",
    cursor: "pointer",
  },
  cancel: {
    padding: "6px 10px",
    borderRadius: 4,
    border: "none",
    backgroundColor: "#6b7280",
    color: "white",
    cursor: "pointer",
  },

  input: {
    width: "100%",
    padding: 6,
    marginBottom: 6,
    borderRadius: 4,
    border: "1px solid #ccc",
    fontSize: 14,
  },
  textarea: {
    width: "100%",
    padding: 6,
    marginBottom: 6,
    borderRadius: 4,
    border: "1px solid #ccc",
    fontSize: 14,
    minHeight: 60,
  },

    save: {
    padding: "6px 10px",
    borderRadius: 4,
    border: "none",
    backgroundColor: "#16a34a",
    color: "white",
    cursor: "pointer",
  },

};

export default IdeaList;

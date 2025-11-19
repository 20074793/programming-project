import React, { useState } from "react";
import { createIdea } from "./api";

function IdeaForm({ onCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [department, setDepartment] = useState("General");
  const [submittedBy, setSubmittedBy] = useState("");
  const [allowAnonymous, setAllowAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // simple validation
    if (!title || !description || (!submittedBy && !allowAnonymous)) {
      setError("Please fill title, description and name or tick anonymous.");
      return;
    }

    try {
      setLoading(true);

      await createIdea({
        title,
        description,
        department,
        submittedBy: allowAnonymous ? "Anonymous" : submittedBy,
        allowAnonymous,
      });

      // reset form
      setTitle("");
      setDescription("");
      setDepartment("General");
      setSubmittedBy("");
      setAllowAnonymous(false);

      if (onCreated) onCreated(); // ask parent to refresh the list
    } catch (err) {
      console.error(err);
      setError("Failed to create idea. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2>Submit a New Idea</h2>

      {error && <p style={styles.error}>{error}</p>}

      <label>
        Title
        <input
          style={styles.input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>

      <label>
        Description
        <textarea
          style={{ ...styles.input, height: 80 }}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>

      <label>
        Department
        <select
          style={styles.input}
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        >
          <option value="General">General</option>
          <option value="IT">IT</option>
          <option value="HR">HR</option>
          <option value="Production">Production</option>
          <option value="Finance">Finance</option>
        </select>
      </label>

      <label>
        Your name
        <input
          style={styles.input}
          value={submittedBy}
          onChange={(e) => setSubmittedBy(e.target.value)}
          disabled={allowAnonymous}
        />
      </label>

      <label style={styles.checkboxRow}>
        <input
          type="checkbox"
          checked={allowAnonymous}
          onChange={(e) => {
            setAllowAnonymous(e.target.checked);
            if (e.target.checked) setSubmittedBy("");
          }}
        />
        Submit anonymously
      </label>

      <button type="submit" style={styles.button} disabled={loading}>
        {loading ? "Submitting..." : "Submit Idea"}
      </button>
    </form>
  );
}

const styles = {
  form: {
    maxWidth: 500,
    margin: "20px auto",
    padding: 20,
    borderRadius: 8,
    border: "1px solid #ccc",
    backgroundColor: "#fafafa",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  input: {
    width: "100%",
    marginTop: 4,
    padding: 8,
    borderRadius: 4,
    border: "1px solid #ccc",
  },
  button: {
    marginTop: 8,
    padding: "8px 12px",
    borderRadius: 4,
    border: "none",
    backgroundColor: "#2563eb",
    color: "white",
    cursor: "pointer",
  },
  error: {
    color: "red",
  },
  checkboxRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
};

export default IdeaForm;

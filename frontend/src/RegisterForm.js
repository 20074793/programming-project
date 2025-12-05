import React, { useState } from "react";
import { registerUser } from "./api";

function RegisterForm({ onRegister }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee", // default
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await registerUser(form);

      if (onRegister) {
        onRegister(data.user, data.token);
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
    } catch (err) {
      console.error("Register error:", err);
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>Create Account</h2>

      {error && <p style={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit}>
        
        <div style={styles.field}>
          <label>Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.field}>
          <label>Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.field}>
          <label>Password</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>

        {/* Role selector */}
        <div style={styles.field}>
          <label>Role</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="employee">Employee</option>
            <option value="approver">Approver</option>
          </select>
        </div>

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  card: {
    maxWidth: 400,
    margin: "20px auto",
    padding: 20,
    borderRadius: 8,
    backgroundColor: "#fff",
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
  },
  title: {
    textAlign: "center",
    marginBottom: 16,
  },
  field: {
    marginBottom: 12,
  },
  input: {
    width: "100%",
    padding: 8,
    borderRadius: 4,
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: 10,
    borderRadius: 4,
    backgroundColor: "#16a34a",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
};

export default RegisterForm;

import React, { useState } from "react";
import IdeaForm from "./IdeaForm";
import IdeaList from "./IdeaList";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";


function App() {
  const [refreshToken, setRefreshToken] = useState(0);

    // Auth state
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  
  // Filters
const [filterDepartment, setFilterDepartment] = useState("all");
const [filterStatus, setFilterStatus] = useState("all");

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setCurrentUser(null);
    setToken("");
  };

  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem("token") || "";
    } catch {
      return "";
    }
  });

  const handleAuthSuccess = (user, tokenValue) => {
    setCurrentUser(user);
    setToken(tokenValue);

    // store in localStorage for next refresh
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", tokenValue);

    // optional: trigger ideas reload
    setRefreshToken((prev) => prev + 1);
  };

  // Which form to show when not logged in: "login" or "register"
  const [authMode, setAuthMode] = useState("login");


  const handleIdeaCreated = () => {
    // change value so IdeaList runs its effect again
    setRefreshToken((prev) => prev + 1);
  };

  return (
  <div>
    {!currentUser ? (
      // NOT LOGGED IN → show auth forms
      <div style={{ maxWidth: 500, margin: "40px auto" }}>
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <button
            onClick={() => setAuthMode("login")}
            disabled={authMode === "login"}
            style={{ marginRight: 8 }}
          >
            Login
          </button>
          <button
            onClick={() => setAuthMode("register")}
            disabled={authMode === "register"}
          >
            Register
          </button>
        </div>

        {authMode === "login" ? (
          <LoginForm onLogin={handleAuthSuccess} />
        ) : (
          <RegisterForm onRegister={handleAuthSuccess} />
        )}
      </div>
    ) : (
      // LOGGED IN → show your existing dashboard
      <>
   <header style={{ 
  padding: 16, 
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
}}>
  <p>
    Logged in as <strong>{currentUser.name}</strong> ({currentUser.role})
  </p>

  <button 
    onClick={handleLogout}
    style={{
      padding: "6px 12px",
      borderRadius: 4,
      border: "none",
      backgroundColor: "#dc2626",
      color: "white",
      cursor: "pointer"
    }}
  >
    Logout
  </button>
</header>


    <div style={styles.page}>
      <header style={styles.header}>
        <h1>Innovation Suggestion Tracker</h1>
        <p>Submit and track ideas inside the company.</p>
      </header>

      <IdeaForm onCreated={handleIdeaCreated} />
      <IdeaList
  refreshToken={refreshToken}
  currentUser={currentUser}
/>
    </div>
      </>
    )}
  </div>
);

}

const styles = {
  page: {
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    backgroundColor: "#f3f4f6",
    minHeight: "100vh",
  },
  header: {
    padding: 20,
    textAlign: "center",
    backgroundColor: "#111827",
    color: "white",
  },
};

export default App;

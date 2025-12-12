import React, { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import EmployeeDashboard from "./EmployeeDashboard";
import ApproverDashboard from "./ApproverDashboard";



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
      ) : currentUser.role === "approver" ? (
        // APPROVER DASHBOARD
        <ApproverDashboard
          currentUser={currentUser}
          token={token}
          onLogout={handleLogout}
          refreshToken={refreshToken}
          filterDepartment={filterDepartment}
          setFilterDepartment={setFilterDepartment}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
        />
      ) : (
        // EMPLOYEE DASHBOARD
        <EmployeeDashboard
          currentUser={currentUser}
          token={token}
          onLogout={handleLogout}
          refreshToken={refreshToken}
          onIdeaCreated={handleIdeaCreated}
          filterDepartment={filterDepartment}
          setFilterDepartment={setFilterDepartment}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
        />
      )}
    </div>
  );
}

export default App;
import React from "react";
import IdeaForm from "./IdeaForm";
import IdeaList from "./IdeaList";

function EmployeeDashboard({
  currentUser,
  onLogout,
  refreshToken,
  onIdeaCreated,
  filterDepartment,
  setFilterDepartment,
  filterStatus,
  setFilterStatus,
}) {
  return (
    <>
      {/* Top bar */}
      <header
        style={{
          padding: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <p>
          Logged in as <strong>{currentUser.name}</strong> (Employee)
        </p>

        <button
          onClick={onLogout}
          style={{
            padding: "6px 12px",
            borderRadius: 4,
            border: "none",
            backgroundColor: "#dc2626",
            color: "white",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </header>

      {/* Dashboard header */}
      <header
        style={{
          padding: 20,
          textAlign: "center",
          backgroundColor: "#111827",
          color: "white",
        }}
      >
        <h1>Employee Dashboard</h1>
        <p>Submit ideas and collaborate with your team.</p>
      </header>



      {/* Employee can submit ideas */}
      <IdeaForm onCreated={onIdeaCreated} />

      {/* Idea list */}
      <IdeaList
        refreshToken={refreshToken}
        currentUser={currentUser}
        filterDepartment={filterDepartment}
        filterStatus={filterStatus}
      />
    </>
  );
}

export default EmployeeDashboard;

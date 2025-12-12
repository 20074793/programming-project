// ApproverDashboard.js

import React from "react";
import IdeaList from "./IdeaList";
import React, { useEffect } from "react";


function ApproverDashboard({
  currentUser,
  onLogout,
  refreshToken,
  filterDepartment,
  setFilterDepartment,
  filterStatus,
  setFilterStatus,
  
}) {
      // Approver default view: start from "submitted" ideas
  useEffect(() => {
    if (filterStatus === "all") {
      setFilterStatus("submitted");
    }
  }, [filterStatus, setFilterStatus]);

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
          Logged in as <strong>{currentUser.name}</strong> (Approver)
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
        <h1>Approver Dashboard</h1>
        <p>Review, approve, or reject submitted ideas.</p>
      </header>
      <div
        style={{
          margin: "16px",
          padding: "12px 16px",
          backgroundColor: "#fff7ed",
          border: "1px solid #fed7aa",
          borderRadius: 8,
        }}
      >
        <strong>Tip:</strong> Focus on <em>Submitted</em> and{" "}
        <em>In Review</em> ideas to approve or reject quickly.
      </div>
      
      <div style={{ display: "flex", gap: 8, padding: "0 16px 8px" }}>
  <button onClick={() => setFilterStatus("submitted")}>Submitted</button>
  <button onClick={() => setFilterStatus("in_review")}>In Review</button>
  <button
    onClick={() => {
      setFilterDepartment("all");
      setFilterStatus("all");
    }}
  >
    Reset
  </button>
</div>

      <div style={{ display: "flex", gap: 16, padding: 16 }}>
        <select
          value={filterDepartment}
          onChange={(e) => setFilterDepartment(e.target.value)}
        >
          <option value="all">All Departments</option>
          <option value="IT">IT</option>
          <option value="HR">HR</option>
          <option value="Finance">Finance</option>
          <option value="Sales">Sales</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="submitted">Submitted</option>
          <option value="in_review">In Review</option>
          <option value="approved">Approved</option>
          <option value="in_progress">In Progress</option>
          <option value="implemented">Implemented</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

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

export default ApproverDashboard;

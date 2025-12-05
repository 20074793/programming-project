import React, { useState } from "react";
import IdeaForm from "./IdeaForm";
import IdeaList from "./IdeaList";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";


function App() {
  const [refreshToken, setRefreshToken] = useState(0);

  const handleIdeaCreated = () => {
    // change value so IdeaList runs its effect again
    setRefreshToken((prev) => prev + 1);
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1>Innovation Suggestion Tracker</h1>
        <p>Submit and track ideas inside the company.</p>
      </header>

      <IdeaForm onCreated={handleIdeaCreated} />
      <IdeaList refreshToken={refreshToken} />
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

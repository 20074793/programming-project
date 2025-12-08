import apiClient from "./apiClient";

// Fetch all ideas
export const getIdeas = async () => {
  const res = await apiClient.get("/api/ideas");
  return res.data;
};

// Create a new idea
export const createIdea = async (data) => {
  const res = await apiClient.post("/api/ideas", data);
  return res.data;
};

// Update an idea
export const updateIdea = async (id, data) => {
  const res = await apiClient.put(`/api/ideas/${id}`, data);
  return res.data;
};

// Delete an idea
export const deleteIdea = async (id) => {
  const res = await apiClient.delete(`/api/ideas/${id}`);
  return res.data;
};

// Update idea status
export const updateIdeaStatus = async (id, status) => {
  const res = await apiClient.patch(`/api/ideas/${id}/status`, { status });
  return res.data;
};

// like idea 
export const likeIdea = async (id) => {
  const res = await apiClient.post(`/api/ideas/${id}/like`);
  return res.data;
};

// add comment to idea 
export const addComment = async (id, commentData) => {
  const res = await apiClient.post(`/api/ideas/${id}/comments`, commentData);
  return res.data;
};

// --- Auth APIs ---

// Register a new user
export const registerUser = async (data) => {
  const res = await apiClient.post("/api/auth/register", data);
  return res.data;
};

// Login existing user
export const loginUser = async (data) => {
  const res = await apiClient.post("/api/auth/login", data);
  return res.data;
};

import axios from "axios";

// Fetch all ideas
export const getIdeas = async () => {
  const res = await axios.get("/api/ideas");
  return res.data;
};

// Create a new idea
export const createIdea = async (data) => {
  const res = await axios.post("/api/ideas", data);
  return res.data;
};

// Update an idea
export const updateIdea = async (id, data) => {
  const res = await axios.put(`/api/ideas/${id}`, data);
  return res.data;
};

// Delete an idea
export const deleteIdea = async (id) => {
  const res = await axios.delete(`/api/ideas/${id}`);
  return res.data;
};

// Update idea status
export const updateIdeaStatus = async (id, status) => {
  const res = await axios.patch(`/api/ideas/${id}/status`, { status });
  return res.data;
};

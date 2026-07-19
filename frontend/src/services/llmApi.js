import api from "./api";

// AI Recommendations
export const getRecommendations = async (data) => {
  return await api.post("/llm/recommendations", data);
};

// Citizen Health Advisor
export const getHealthAdvisor = async (data) => {
  return await api.post("/llm/health-advisor", data);
};

// AI Copilot
export const askCopilot = async (data) => {
  return await api.post("/llm/copilot", data);
};

// Report Generator
export const generateReport = async (data) => {
  return await api.post("/llm/report", data);
};
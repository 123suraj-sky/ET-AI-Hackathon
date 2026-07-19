import api from "./api";

export const getHealthAdvisor = (data) => {
  return api.post("/llm/health-advisor", data);
};
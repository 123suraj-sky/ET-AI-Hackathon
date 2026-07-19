import api from "./api";

export const generateReport = (data) => {
  return api.post("/llm/report", data);
};
import api from "./api";

export const getSourceAnalysis = () => {
  return api.get("/source-analysis");
};
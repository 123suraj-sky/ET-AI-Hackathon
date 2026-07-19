import api from "./api";

export const getForecastData = () => {
  return api.get("/forecast");
};
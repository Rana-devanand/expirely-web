import { api } from "./api";

export const dashboardService = {
  getStats: async () => {
    const response: any = await api.get("/dashboard/stats");
    return response.data;
  },

  getCharts: async () => {
    const response: any = await api.get("/dashboard/charts");
    return response.data;
  }
};

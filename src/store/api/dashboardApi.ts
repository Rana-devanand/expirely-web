import { baseApi } from './baseApi';

interface DashboardStatsResponse {
  success: boolean;
  data: {
    totalUsers: number;
    userChange: string;
    activeUsers: number;
    activeChange: string;
    totalProducts: number;
    productChange: string;
    expiringSoon: number;
    notificationsSent: number;
    notificationChange: string;
  };
}

interface DashboardChartsResponse {
  success: boolean;
  data: {
    userGrowth: Record<string, string | number>[];
    productTrends: Record<string, string | number>[];
    categoryData: Record<string, string | number>[];
    notificationActivity: Record<string, string | number>[];
  };
}

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStats: builder.query<DashboardStatsResponse, void>({
      query: () => '/dashboard/stats',
      providesTags: ['Stats'],
    }),
    getCharts: builder.query<DashboardChartsResponse, void>({
      query: () => '/dashboard/charts',
      providesTags: ['Charts'],
    }),
    getTableStats: builder.query<{
      success: boolean;
      data: {
        tables: Array<{
          name: string;
          group: string;
          description: string;
          count: number | null;
          available: boolean;
        }>;
        totalTables: number;
        availableTables: number;
        totalRecords: number;
        generatedAt: string;
      };
    }, void>({
      query: () => '/dashboard/tables',
      providesTags: ['Tables'],
    }),
  }),
});

export const { useGetStatsQuery, useGetChartsQuery, useGetTableStatsQuery } = dashboardApi;

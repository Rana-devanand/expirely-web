import { baseApi } from './baseApi';

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStats: builder.query<any, void>({
      query: () => '/dashboard/stats',
      providesTags: ['Stats'],
    }),
    getCharts: builder.query<any, void>({
      query: () => '/dashboard/charts',
      providesTags: ['Charts'],
    }),
  }),
});

export const { useGetStatsQuery, useGetChartsQuery } = dashboardApi;

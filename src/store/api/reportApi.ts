import { baseApi } from './baseApi';

export const reportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminReports: builder.query<any, void>({
      query: () => '/reports',
      providesTags: ['Reports'],
    }),
  }),
});

export const { useGetAdminReportsQuery } = reportApi;

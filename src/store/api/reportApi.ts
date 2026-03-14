import { baseApi } from './baseApi';

export const reportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminReports: builder.query<any, void>({
      query: () => '/reports',
      providesTags: ['Reports'],
    }),
    exportReport: builder.query<Blob, { type: string; format: string }>({
      query: ({ type, format }) => ({
        url: `/reports/export/${type}/${format}`,
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

export const { useGetAdminReportsQuery, useLazyExportReportQuery } = reportApi;

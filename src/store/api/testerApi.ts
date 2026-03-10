import { baseApi } from './baseApi';

export const testerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllTesters: builder.query<any, void>({
      query: () => '/testers',
      providesTags: ['Testers'],
    }),
  }),
});

export const { useGetAllTestersQuery } = testerApi;

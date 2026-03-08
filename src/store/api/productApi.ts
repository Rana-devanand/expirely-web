import { baseApi } from './baseApi';

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminProducts: builder.query<any, void>({
      query: () => '/products/admin',
      providesTags: ['Products'],
    }),
  }),
});

export const { useGetAdminProductsQuery } = productApi;

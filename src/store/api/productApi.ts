import { baseApi } from './baseApi';

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminProducts: builder.query<any, void>({
      query: () => '/products/admin',
      providesTags: ['Products'],
    }),
    getAdminProductById: builder.query<any, string>({
      query: (id) => `/products/admin/${id}`,
      providesTags: (result, error, id) => [{ type: 'Products', id }],
      transformResponse: (response: any) => response.data,
    }),
    getProducts: builder.query<any, void>({
      query: () => '/products',
      providesTags: ['Products'],
    }),
    createProduct: builder.mutation<any, any>({
      query: (body) => ({
        url: '/products',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Products'],
    }),
    deleteProduct: builder.mutation<any, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Products'],
    }),
  }),
});

export const { 
  useGetAdminProductsQuery,
  useGetAdminProductByIdQuery,
  useGetProductsQuery,
  useCreateProductMutation,
  useDeleteProductMutation
} = productApi;

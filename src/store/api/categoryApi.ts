import { baseApi } from './baseApi';

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCategories: builder.query<any, void>({
      query: () => '/categories',
      providesTags: ['Categories'],
      transformResponse: (response: any) => response.data,
    }),
    createCategory: builder.mutation<any, { name: string; color?: string; icon?: string }>({
      query: (data) => ({
        url: '/categories',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Categories'],
    }),
    deleteCategory: builder.mutation<any, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Categories'],
    }),
  }),
});

export const { 
  useGetAllCategoriesQuery, 
  useCreateCategoryMutation, 
  useDeleteCategoryMutation 
} = categoryApi;

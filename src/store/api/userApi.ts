import { baseApi } from './baseApi';

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query<any[], void>({
      query: () => '/users',
      providesTags: ['Users'],
      // Transform response to match previous service expectations if needed
      transformResponse: (response: any) => response.data,
    }),
    updateUserStatus: builder.mutation<any, { userId: string; status: 'active' | 'blocked' }>({
      query: ({ userId, status }) => ({
        url: `/users/${userId}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: ['Users', 'Stats'], // Invalidate users list and dashboard stats
    }),
  }),
});

export const { useGetAllUsersQuery, useUpdateUserStatusMutation } = userApi;

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
    broadcastEmail: builder.mutation<any, { subject: string; content: string; recipients: string[] }>({
      query: (body) => ({
        url: '/users/admin/broadcast-email',
        method: 'POST',
        body,
      }),
    }),
    unsubscribe: builder.mutation<any, { email: string }>({
      query: (body) => ({
        url: '/users/unsubscribe',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { 
  useGetAllUsersQuery, 
  useUpdateUserStatusMutation, 
  useBroadcastEmailMutation,
  useUnsubscribeMutation
} = userApi;

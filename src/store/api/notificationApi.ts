import { baseApi } from './baseApi';

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminNotifications: builder.query<any, void>({
      query: () => '/notifications/admin',
      providesTags: ['Notifications'],
    }),
    adminSendNotification: builder.mutation<any, { target: string; message: string; type?: string }>({
      query: (body) => ({
        url: '/notifications/admin/send',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Notifications'],
    }),
  }),
});

export const { useGetAdminNotificationsQuery, useAdminSendNotificationMutation } = notificationApi;

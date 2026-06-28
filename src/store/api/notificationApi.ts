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
    getAdminPushLogs: builder.query<any, void>({
      query: () => '/notifications/admin/broadcast-push/logs',
      providesTags: ['Notifications'],
    }),
    adminSendPushNotification: builder.mutation<any, { title: string; body: string; data?: Record<string, string>; recipients?: string[] }>({
      query: (body) => ({
        url: '/notifications/admin/broadcast-push',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Notifications'],
    }),
    adminGeneratePush: builder.mutation<{ success: boolean; data: { title: string; body: string } }, { prompt: string }>({
      query: (body) => ({
        url: '/notifications/admin/generate-push',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { 
  useGetAdminNotificationsQuery, 
  useAdminSendNotificationMutation,
  useGetAdminPushLogsQuery,
  useAdminSendPushNotificationMutation,
  useAdminGeneratePushMutation
} = notificationApi;

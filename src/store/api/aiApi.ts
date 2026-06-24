import { baseApi } from './baseApi';

export const aiApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    generateBroadcastEmail: builder.query<{ subject: string; body: string }, { type: string }>({
      query: ({ type }) => `/ai/generate-broadcast-email?type=${type}`,
      transformResponse: (response: any) => response.data,
    }),
  }),
});

export const { useLazyGenerateBroadcastEmailQuery } = aiApi;

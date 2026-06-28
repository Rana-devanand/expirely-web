import { baseApi } from './baseApi';

export const aiApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    generateBroadcastEmail: builder.query<{ subject: string; body: string }, { type: string; prompt?: string }>({
      query: ({ type, prompt }) => {
        let url = `/ai/generate-broadcast-email?type=${type}`;
        if (prompt) {
          url += `&prompt=${encodeURIComponent(prompt)}`;
        }
        return url;
      },
      transformResponse: (response: any) => response.data,
    }),
  }),
});

export const { useLazyGenerateBroadcastEmailQuery } = aiApi;

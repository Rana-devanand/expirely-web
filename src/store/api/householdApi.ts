import { baseApi } from './baseApi';

export interface HouseholdOwner {
  id: string;
  username: string;
  email: string;
  avatar_url: string | null;
}

export interface HouseholdMember {
  id: string;
  user_id: string;
  role: 'OWNER' | 'MEMBER';
  joined_at: string;
  username: string;
  email: string;
  avatar_url: string | null;
}

export interface AdminHousehold {
  id: string;
  name: string;
  join_code: string;
  created_at: string;
  owner: HouseholdOwner;
  members: HouseholdMember[];
  member_count: number;
  product_count: number;
}

export const householdApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminHouseholds: builder.query<{ success: boolean; data: AdminHousehold[] }, void>({
      query: () => '/households/admin/all',
      providesTags: ['Households'],
    }),
  }),
});

export const { useGetAdminHouseholdsQuery } = householdApi;

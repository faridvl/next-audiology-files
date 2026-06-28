import { ApiServiceClient } from '@/shared/api/api-service-client';
import { env } from '@/shared/api/config';
import { UserDetail } from '@/types/users/user.types';
import { useQuery } from '@tanstack/react-query';

export const FETCH_USER_DETAIL_KEY = 'fetchUserDetail';
const IDENTITY_URL = env.API.IDENTITY_URL;

export const UserDetailService = {
  fetchByUuid: async (userUuid: string): Promise<UserDetail> => {
    return await ApiServiceClient(IDENTITY_URL).get<UserDetail>(`/users/${userUuid}`);
  },
};

export function useGetUserQuery(userUuid: string) {
  return useQuery({
    queryKey: [FETCH_USER_DETAIL_KEY, userUuid],
    queryFn: () => UserDetailService.fetchByUuid(userUuid),
    enabled: !!userUuid,
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
  });
}

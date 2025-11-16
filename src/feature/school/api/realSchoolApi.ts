import type { UserInfoResponse } from '@/feature/auth/types/auth';
import { apiClient } from '@/shared/api/client';

export const realSchoolApi = {
  // PUT /users/school - Swagger 명세에 따라 빈 본문으로 호출
  connectSchool: async (): Promise<UserInfoResponse> => {
    return apiClient.put<UserInfoResponse>('/users/school', {});
  },
};

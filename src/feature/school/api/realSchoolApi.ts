import { apiClient } from '@/shared/api/client';
import type { SchoolConnectRequest, SchoolResponse } from '../types';

export const realSchoolApi = {
  connectSchool: async (data: SchoolConnectRequest): Promise<SchoolResponse> => {
    return apiClient.put<SchoolResponse>('/users/school', data);
  },
};

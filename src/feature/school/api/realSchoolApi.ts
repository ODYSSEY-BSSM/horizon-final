import type { UserInfoResponse } from '@/feature/auth/types/auth';
import { apiClient } from '@/shared/api/client';
import type { Subject } from '@/shared/api/types';
import type {
  EducationApiResponse,
  EducationCountResponse,
  EducationSubjectResponse,
} from '../types/schoolApi';

export const realSchoolApi = {
  // PUT /users/school - Swagger 명세에 따라 빈 본문으로 호출
  connectSchool: async (): Promise<UserInfoResponse> => {
    return apiClient.put<UserInfoResponse>('/users/school', {});
  },

  // GET /education - 과목별 교육 자료 목록 조회 (subject 필수)
  getEducationList: async (subject: Subject): Promise<EducationApiResponse[]> => {
    return apiClient.get<EducationApiResponse[]>('/education', {
      params: { subject },
    });
  },

  // GET /education/subject - 전체 교육 과목 정보 조회
  getEducationInfo: async (): Promise<EducationSubjectResponse> => {
    return apiClient.get<EducationSubjectResponse>('/education/subject');
  },

  // GET /education/count - 교육 노드 카운트
  getEducationCount: async (): Promise<EducationCountResponse> => {
    return apiClient.get<EducationCountResponse>('/education/count');
  },
};

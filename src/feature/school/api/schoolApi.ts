import { realSchoolApi } from './realSchoolApi';

// Swagger 명세에 정의된 엔드포인트만 사용
export const schoolApi = {
  connectSchool: realSchoolApi.connectSchool,
};

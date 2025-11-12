import type {
  TeamApplyListResponse,
  TeamApplyResponse,
  TeamCreateRequest,
  TeamMembersResponse,
  TeamResponse,
  TeamUpdateRequest,
} from '../types';
import { mockTeamApi } from '@/shared/api/mock/mockTeamApi';

// Mock API 사용 (실제 API 대신)
export const teamApi = mockTeamApi;

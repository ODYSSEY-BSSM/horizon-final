import type {
  RoadmapCountResponse,
  RoadmapCreateRequest,
  RoadmapResponse,
  RoadmapUpdateRequest,
  TeamRoadmapCreateRequest,
  TeamRoadmapResponse,
} from '../types';
import { mockRoadmapApi } from '@/shared/api/mock/mockRoadmapApi';

// Mock API 사용 (실제 API 대신)
export const roadmapApi = mockRoadmapApi;

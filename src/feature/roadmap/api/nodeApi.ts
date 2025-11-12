import type {
  EducationNodeConvertRequest,
  NodeCreateRequest,
  NodeListResponse,
  NodeResponse,
  NodeUpdateRequest,
} from '../types';
import { mockNodeApi } from '@/shared/api/mock/mockRoadmapApi';

// Mock API 사용 (실제 API 대신)
export const nodeApi = mockNodeApi;

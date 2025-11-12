import type {
  DirectoryContentResponse,
  DirectoryCreateRequest,
  DirectoryResponse,
  DirectoryUpdateRequest,
  TeamDirectoryCreateRequest,
  TeamDirectoryResponse,
  TeamDirectoryUpdateRequest,
} from '../types';
import { mockFolderApi } from '@/shared/api/mock/mockFolderApi';

// Mock API 사용 (실제 API 대신)
export const folderApi = mockFolderApi;

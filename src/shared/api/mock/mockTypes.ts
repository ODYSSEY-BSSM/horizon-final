
import type { UserRole } from '@/shared/api/types';

export interface MockUser {
  id: number;
  email: string;
  password: string;
  username: string;
  role: UserRole;
  teamIds: number[];
  schoolId?: number;
}

export interface MockSchool {
  id: number;
  name: string;
  code: string;
  logoUrl?: string;
}

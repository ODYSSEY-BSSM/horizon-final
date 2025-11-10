# 마이그레이션 가이드

> 작성일: 2025-11-10
> 상태: 실행 준비 완료

## 목차

- [개요](#개요)
- [사전 준비](#사전-준비)
- [Phase 1: shared 정리](#phase-1-shared-정리)
- [Phase 2: feature/roadmap 생성](#phase-2-featureroadmap-생성)
- [Phase 3: 나머지 feature 생성](#phase-3-나머지-feature-생성)
- [Phase 4: app 얇게 만들기](#phase-4-app-얇게-만들기)
- [Phase 5: 테스트 설정](#phase-5-테스트-설정)
- [검증 체크리스트](#검증-체크리스트)

---

## 개요

### 목표

- 현재 아키텍처를 **Feature-Sliced Design** 기반으로 재구조화
- 코드 중복 약 1,000줄 이상 제거
- 테스트 커버리지 0% → 60% 이상
- 유지보수성 및 확장성 향상

### 예상 소요 시간

- **Phase 1**: 1주 (5일)
- **Phase 2**: 2주 (10일) - 가장 중요
- **Phase 3**: 2주 (10일)
- **Phase 4**: 1주 (5일)
- **Phase 5**: 1주 (5일)
- **총 7주 (35일)**

### 원칙

1. **점진적 마이그레이션**: 한 번에 하나의 기능씩
2. **테스트 우선**: 이동 전 테스트 작성, 이동 후 테스트 검증
3. **커밋 단위**: 작은 단위로 자주 커밋
4. **롤백 가능**: 각 단계마다 롤백 가능하도록
5. **문서화**: 변경 사항을 문서화

---

## 사전 준비

### 1. Git 브랜치 생성

```bash
git checkout -b refactor/architecture-migration
```

### 2. 백업

```bash
# 현재 상태 태그
git tag backup/before-migration

# 백업 브랜치
git branch backup/current-state
```

### 3. 의존성 확인

```bash
npm install
npm run build
```

### 4. TypeScript 경로 별칭 설정

```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/app/*": ["./src/app/*"],
      "@/feature/*": ["./src/feature/*"],
      "@/shared/*": ["./src/shared/*"],
      "@/test/*": ["./src/test/*"]
    }
  }
}
```

---

## Phase 1: shared 정리

### 목표

- 공통 컴포넌트를 `shared/ui`로 이동
- API 클라이언트를 `shared/api`로 이동
- 공통 훅을 `shared/hooks`로 이동
- 공통 타입을 `shared/types`로 이동

### 1.1 디렉토리 생성

```bash
mkdir -p src/shared/ui
mkdir -p src/shared/api
mkdir -p src/shared/hooks
mkdir -p src/shared/types
mkdir -p src/shared/constants
mkdir -p src/shared/lib
```

### 1.2 공통 컴포넌트 이동

```bash
# Button 이동
mv src/components/common/Button src/shared/ui/Button

# Text 이동
mv src/components/common/Text src/shared/ui/Text

# Icon 이동
mv src/components/common/Icon src/shared/ui/Icon

# TextField 이동
mv src/components/common/TextField src/shared/ui/TextField

# Divider 이동
mv src/components/common/Divider src/shared/ui/Divider
```

### 1.3 shared/ui/index.ts 생성

```typescript
// src/shared/ui/index.ts
export { Button } from './Button/Button';
export type { ButtonProps } from './Button/Button.types';

export { Text } from './Text/Text';
export type { TextProps } from './Text/Text.types';

export { Icon } from './Icon/Icon';
export type { IconProps } from './Icon/Icon.types';

export { TextField } from './TextField/TextField';
export type { TextFieldProps } from './TextField/TextField.types';

export { Divider } from './Divider/Divider';
export type { DividerProps } from './Divider/Divider.types';
```

### 1.4 API 클라이언트 이동

```bash
# API 클라이언트 이동
mv src/lib/api/client.ts src/shared/api/client.ts
```

### 1.5 shared/api/errors.ts 생성

```typescript
// src/shared/api/errors.ts
export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }

  static fromResponse(status: number, data: { code?: string; message?: string }) {
    return new ApiError(
      status,
      data.code || 'UNKNOWN_ERROR',
      data.message || 'An error occurred',
      data,
    );
  }

  isNetworkError() {
    return this.status === 0;
  }

  isUnauthorized() {
    return this.status === 401;
  }

  isForbidden() {
    return this.status === 403;
  }

  isNotFound() {
    return this.status === 404;
  }

  isServerError() {
    return this.status >= 500;
  }
}
```

### 1.6 shared/api/types.ts 생성

```typescript
// src/shared/api/types.ts
export interface ApiResponse<T> {
  data: T;
  message?: string;
  code?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
}

export interface ApiErrorResponse {
  code: string;
  message: string;
  details?: unknown;
}
```

### 1.7 shared/api/index.ts 생성

```typescript
// src/shared/api/index.ts
export { apiClient } from './client';
export { ApiError } from './errors';
export type { ApiResponse, PaginatedResponse, ApiErrorResponse } from './types';
```

### 1.8 공통 타입 생성

```typescript
// src/shared/types/common.ts
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type ID = string;

export interface SelectOption<T = string> {
  label: string;
  value: T;
}

export type DateString = string;
export type ISODateString = string;

export interface Timestamps {
  createdAt: DateString;
  updatedAt: DateString;
}
```

### 1.9 공통 상수 생성

```typescript
// src/shared/constants/routes.ts
export const ROUTES = {
  HOME: '/',
  SIGNIN: '/signin',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  MY_ROADMAPS: '/my-roadmaps',
  TEAM_SPACE: '/team-space',
  SCHOOL_CONNECT: '/school-connect',
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];
```

```typescript
// src/shared/constants/config.ts
export const APP_CONFIG = {
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || '',
  APP_NAME: 'Horizon',
  APP_VERSION: '1.0.0',
} as const;
```

### 1.10 import 경로 수정

**Before:**
```typescript
import { Button } from '@/components/common/Button/Button';
import { apiClient } from '@/lib/api/client';
```

**After:**
```typescript
import { Button } from '@/shared/ui';
import { apiClient } from '@/shared/api';
```

**자동 수정 스크립트:**
```bash
# Button import 수정
find src -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i 's|@/components/common/Button|@/shared/ui|g'

# API client import 수정
find src -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i 's|@/lib/api/client|@/shared/api|g'
```

### 1.11 검증

```bash
# 빌드 확인
npm run build

# 린트 확인
npm run lint

# 타입 체크
npx tsc --noEmit

# Git 커밋
git add .
git commit -m "refactor: Phase 1 - shared 디렉토리 정리"
```

---

## Phase 2: feature/roadmap 생성

### 목표

가장 중복이 많은 **roadmap 기능**을 통합하여 중복 제거

### 2.1 디렉토리 생성

```bash
mkdir -p src/feature/roadmap/components
mkdir -p src/feature/roadmap/hooks
mkdir -p src/feature/roadmap/api
mkdir -p src/feature/roadmap/types
mkdir -p src/feature/roadmap/constants
mkdir -p src/feature/roadmap/stores
```

### 2.2 Roadmap 타입 통합

```typescript
// src/feature/roadmap/types/roadmap.ts
export type RoadmapColor = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple';

export type RoadmapStatus = 'not-started' | 'in-progress' | 'completed';

export type RoadmapType = 'personal' | 'team';

export interface Roadmap {
  id: string;
  name: string;
  description?: string;
  icon: string;
  color: RoadmapColor;
  type: RoadmapType;
  totalSteps: number;
  completedSteps: number;
  status: RoadmapStatus;
  progress: number; // 0-100
  folderId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RoadmapFolder {
  id: string;
  name: string;
  icon: string;
  color: RoadmapColor;
  roadmapCount: number;
}

export interface CreateRoadmapRequest {
  name: string;
  description?: string;
  icon: string;
  color: RoadmapColor;
  type: RoadmapType;
  folderId?: string;
}

export interface UpdateRoadmapRequest extends Partial<CreateRoadmapRequest> {
  id: string;
}
```

```typescript
// src/feature/roadmap/types/index.ts
export type {
  Roadmap,
  RoadmapColor,
  RoadmapStatus,
  RoadmapType,
  RoadmapFolder,
  CreateRoadmapRequest,
  UpdateRoadmapRequest,
} from './roadmap';
```

### 2.3 ROADMAP_COLORS 상수 통합

```typescript
// src/feature/roadmap/constants/colors.ts
import type { RoadmapColor } from '../types';

export const ROADMAP_COLORS = {
  red: { bg: '#FEE2E2', icon: '#DC2626' },
  orange: { bg: '#FFEDD5', icon: '#EA580C' },
  yellow: { bg: '#FEF3C7', icon: '#CA8A04' },
  green: { bg: '#D1FAE5', icon: '#059669' },
  blue: { bg: '#DBEAFE', icon: '#2563EB' },
  purple: { bg: '#E9D5FF', icon: '#9333EA' },
} as const satisfies Record<RoadmapColor, { bg: string; icon: string }>;

export const ROADMAP_COLOR_OPTIONS: Array<{ label: string; value: RoadmapColor }> = [
  { label: 'Red', value: 'red' },
  { label: 'Orange', value: 'orange' },
  { label: 'Yellow', value: 'yellow' },
  { label: 'Green', value: 'green' },
  { label: 'Blue', value: 'blue' },
  { label: 'Purple', value: 'purple' },
];
```

```typescript
// src/feature/roadmap/constants/index.ts
export { ROADMAP_COLORS, ROADMAP_COLOR_OPTIONS } from './colors';
```

### 2.4 Pagination 컴포넌트 통합

**4곳의 Pagination.tsx 중 가장 완전한 버전을 선택하여 이동**

```bash
# 가장 완전한 버전 복사 (예: dashboard의 것)
cp src/app/\(main\)/dashboard/_components/Pagination.tsx src/feature/roadmap/components/Pagination/

# 타입 분리
touch src/feature/roadmap/components/Pagination/Pagination.types.ts
```

```typescript
// src/feature/roadmap/components/Pagination/Pagination.types.ts
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
```

```typescript
// src/feature/roadmap/components/Pagination/Pagination.tsx
import type { PaginationProps } from './Pagination.types';
// ... (기존 코드, import만 수정)
```

```typescript
// src/feature/roadmap/components/Pagination/index.ts
export { default as Pagination } from './Pagination';
export type { PaginationProps } from './Pagination.types';
```

### 2.5 useDropdown 훅 통합

```bash
# 2곳 중 하나를 복사
cp src/app/\(main\)/dashboard/_hooks/useDropdown.ts src/feature/roadmap/hooks/
```

```typescript
// src/feature/roadmap/hooks/useDropdown.ts
// ... (기존 코드 그대로)
```

```typescript
// src/feature/roadmap/hooks/index.ts
export { default as useDropdown } from './useDropdown';
```

### 2.6 RoadmapListItem 컴포넌트 통합

**3곳의 RoadmapListItem.tsx를 하나로 통합**

```typescript
// src/feature/roadmap/components/RoadmapListItem/RoadmapListItem.types.ts
import type { Roadmap } from '../../types';

export interface RoadmapListItemProps {
  roadmap: Roadmap;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}
```

```typescript
// src/feature/roadmap/components/RoadmapListItem/RoadmapListItem.tsx
import { Icon, Text } from '@/shared/ui';
import { ROADMAP_COLORS } from '../../constants';
import type { RoadmapListItemProps } from './RoadmapListItem.types';
import * as S from './RoadmapListItem.styles';

export function RoadmapListItem({
  roadmap,
  onClick,
  onEdit,
  onDelete,
  showActions = true,
}: RoadmapListItemProps) {
  const colors = ROADMAP_COLORS[roadmap.color];

  return (
    <S.Container onClick={onClick}>
      <S.IconWrapper $bgColor={colors.bg}>
        <Icon name={roadmap.icon} size={24} color={colors.icon} />
      </S.IconWrapper>

      <S.Content>
        <S.TitleRow>
          <Text variant="body1" weight="medium">
            {roadmap.name}
          </Text>
          <Text variant="caption" color="textSecondary">
            {roadmap.completedSteps}/{roadmap.totalSteps} steps
          </Text>
        </S.TitleRow>

        <S.ProgressBar>
          <S.ProgressFill $progress={roadmap.progress} $color={colors.icon} />
        </S.ProgressBar>
      </S.Content>

      {showActions && (
        <S.Actions>
          {onEdit && <Icon name="edit" size={20} onClick={onEdit} />}
          {onDelete && <Icon name="delete" size={20} onClick={onDelete} />}
        </S.Actions>
      )}
    </S.Container>
  );
}
```

```typescript
// src/feature/roadmap/components/RoadmapListItem/index.ts
export { RoadmapListItem } from './RoadmapListItem';
export type { RoadmapListItemProps } from './RoadmapListItem.types';
```

### 2.7 FilterTabs 컴포넌트 통합

```typescript
// src/feature/roadmap/components/FilterTabs/FilterTabs.types.ts
export type RoadmapFilter = 'all' | 'personal' | 'team' | 'in-progress' | 'completed';

export interface FilterTabsProps {
  activeFilter: RoadmapFilter;
  onFilterChange: (filter: RoadmapFilter) => void;
  counts?: Record<RoadmapFilter, number>;
}
```

```typescript
// src/feature/roadmap/components/FilterTabs/FilterTabs.tsx
import { Button } from '@/shared/ui';
import type { FilterTabsProps, RoadmapFilter } from './FilterTabs.types';
import * as S from './FilterTabs.styles';

const FILTERS: Array<{ value: RoadmapFilter; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'personal', label: 'Personal' },
  { value: 'team', label: 'Team' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

export function FilterTabs({ activeFilter, onFilterChange, counts }: FilterTabsProps) {
  return (
    <S.Container>
      {FILTERS.map((filter) => (
        <S.Tab
          key={filter.value}
          $active={activeFilter === filter.value}
          onClick={() => onFilterChange(filter.value)}
        >
          {filter.label}
          {counts && counts[filter.value] > 0 && (
            <S.Count>{counts[filter.value]}</S.Count>
          )}
        </S.Tab>
      ))}
    </S.Container>
  );
}
```

### 2.8 Roadmap API 생성

```typescript
// src/feature/roadmap/api/roadmap.api.ts
import { apiClient } from '@/shared/api';
import type { Roadmap, CreateRoadmapRequest, UpdateRoadmapRequest } from '../types';

export const roadmapApi = {
  async getRoadmaps(folderId?: string): Promise<Roadmap[]> {
    const params = folderId ? { folderId } : {};
    const response = await apiClient.get<Roadmap[]>('/roadmaps', { params });
    return response;
  },

  async getRoadmap(id: string): Promise<Roadmap> {
    const response = await apiClient.get<Roadmap>(`/roadmaps/${id}`);
    return response;
  },

  async createRoadmap(data: CreateRoadmapRequest): Promise<Roadmap> {
    const response = await apiClient.post<Roadmap>('/roadmaps', data);
    return response;
  },

  async updateRoadmap({ id, ...data }: UpdateRoadmapRequest): Promise<Roadmap> {
    const response = await apiClient.patch<Roadmap>(`/roadmaps/${id}`, data);
    return response;
  },

  async deleteRoadmap(id: string): Promise<void> {
    await apiClient.delete(`/roadmaps/${id}`);
  },
};
```

```typescript
// src/feature/roadmap/api/index.ts
export { roadmapApi } from './roadmap.api';
```

### 2.9 Roadmap Hooks 생성

```typescript
// src/feature/roadmap/hooks/useRoadmaps.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { roadmapApi } from '../api';
import type { CreateRoadmapRequest, UpdateRoadmapRequest } from '../types';

const QUERY_KEYS = {
  roadmaps: (folderId?: string) => ['roadmaps', folderId] as const,
  roadmap: (id: string) => ['roadmap', id] as const,
};

export function useRoadmaps(folderId?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.roadmaps(folderId),
    queryFn: () => roadmapApi.getRoadmaps(folderId),
  });
}

export function useRoadmap(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.roadmap(id),
    queryFn: () => roadmapApi.getRoadmap(id),
    enabled: !!id,
  });
}

export function useCreateRoadmap() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRoadmapRequest) => roadmapApi.createRoadmap(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.roadmaps(variables.folderId) });
    },
  });
}

export function useUpdateRoadmap() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateRoadmapRequest) => roadmapApi.updateRoadmap(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.roadmap(data.id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.roadmaps() });
    },
  });
}

export function useDeleteRoadmap() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => roadmapApi.deleteRoadmap(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.roadmaps() });
    },
  });
}
```

```typescript
// src/feature/roadmap/hooks/index.ts
export { default as useDropdown } from './useDropdown';
export {
  useRoadmaps,
  useRoadmap,
  useCreateRoadmap,
  useUpdateRoadmap,
  useDeleteRoadmap,
} from './useRoadmaps';
```

### 2.10 feature/roadmap Public API

```typescript
// src/feature/roadmap/index.ts
// Components
export { Pagination } from './components/Pagination';
export { RoadmapListItem } from './components/RoadmapListItem';
export { FilterTabs } from './components/FilterTabs';

// Hooks
export {
  useDropdown,
  useRoadmaps,
  useRoadmap,
  useCreateRoadmap,
  useUpdateRoadmap,
  useDeleteRoadmap,
} from './hooks';

// Types
export type {
  Roadmap,
  RoadmapColor,
  RoadmapStatus,
  RoadmapType,
  RoadmapFolder,
  CreateRoadmapRequest,
  UpdateRoadmapRequest,
} from './types';

// Constants
export { ROADMAP_COLORS, ROADMAP_COLOR_OPTIONS } from './constants';

// API (일반적으로 export 안하지만, 필요한 경우)
// export { roadmapApi } from './api';
```

### 2.11 기존 코드 수정

**Before:**
```typescript
// app/dashboard/content.tsx
import Pagination from './_components/Pagination';
import RoadmapListItem from './_components/RoadmapListItem';
import useDropdown from './_hooks/useDropdown';
```

**After:**
```typescript
// app/dashboard/content.tsx
import { Pagination, RoadmapListItem, useDropdown } from '@/feature/roadmap';
```

### 2.12 기존 파일 삭제

```bash
# Pagination 삭제 (4곳)
rm src/app/\(main\)/dashboard/_components/Pagination.tsx
rm src/app/\(main\)/my-roadmaps/\[folderId\]/_components/Pagination.tsx
rm src/app/\(main\)/school-connect/_components/Pagination.tsx
rm src/app/\(main\)/team-space/\[teamId\]/\[folderId\]/_components/Pagination.tsx

# useDropdown 삭제 (2곳)
rm src/app/\(main\)/dashboard/_hooks/useDropdown.ts
rm src/app/\(main\)/my-roadmaps/_hooks/useDropdown.ts

# RoadmapListItem 삭제 (3곳)
rm src/app/\(main\)/dashboard/_components/RoadmapListItem.tsx
rm src/app/\(main\)/my-roadmaps/\[folderId\]/_components/RoadmapListItem.tsx
rm src/app/\(main\)/team-space/\[teamId\]/\[folderId\]/_components/RoadmapListItem.tsx
```

### 2.13 검증

```bash
# 빌드 확인
npm run build

# 린트 확인
npm run lint

# 타입 체크
npx tsc --noEmit

# Git 커밋
git add .
git commit -m "refactor: Phase 2 - feature/roadmap 생성 및 통합"
```

---

## Phase 3: 나머지 feature 생성

### 3.1 feature/auth 생성

```bash
mkdir -p src/feature/auth/{components,hooks,api,types,stores,validations}
```

```typescript
// src/feature/auth/types/user.ts
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
```

```bash
# 인증 관련 파일 이동
mv src/lib/auth/* src/feature/auth/api/
mv src/lib/stores/signupFlow.ts src/feature/auth/stores/
mv src/lib/validations/signup.ts src/feature/auth/validations/
```

### 3.2 feature/dashboard 생성

```bash
mkdir -p src/feature/dashboard/{components,hooks,api,types}
```

```bash
# 대시보드 컴포넌트 이동 (roadmap 제외)
mv src/app/\(main\)/dashboard/_components/GreetingSection src/feature/dashboard/components/
mv src/app/\(main\)/dashboard/_components/InfoCardsGrid src/feature/dashboard/components/
mv src/app/\(main\)/dashboard/_components/DashboardHeader src/feature/dashboard/components/
```

### 3.3 feature/team 생성

```bash
mkdir -p src/feature/team/{components,hooks,api,types}
```

### 3.4 feature/school-connect 생성

```bash
mkdir -p src/feature/school-connect/{components,hooks,api,types}
```

---

## Phase 4: app 얇게 만들기

### 목표

`app` 디렉토리는 라우팅만 담당하도록 최소화

### 4.1 Before & After 예시

**Before:**
```typescript
// app/dashboard/content.tsx (복잡)
'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import GreetingSection from './_components/GreetingSection';
import InfoCardsGrid from './_components/InfoCardsGrid';
import RoadmapList from './_components/RoadmapList';

export default function DashboardContent() {
  const [filter, setFilter] = useState('all');
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboardData,
  });

  // ... 복잡한 로직

  return (
    <div>
      <GreetingSection user={data?.user} />
      <InfoCardsGrid stats={data?.stats} />
      <RoadmapList filter={filter} onFilterChange={setFilter} />
    </div>
  );
}
```

**After:**
```typescript
// app/dashboard/page.tsx (얇게)
import { DashboardContent } from '@/feature/dashboard';

export default function DashboardPage() {
  return <DashboardContent />;
}

// feature/dashboard/components/DashboardContent.tsx (로직 이동)
'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { GreetingSection } from './GreetingSection';
import { InfoCardsGrid } from './InfoCardsGrid';
import { RoadmapList } from '@/feature/roadmap';

export function DashboardContent() {
  const [filter, setFilter] = useState('all');
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboardData,
  });

  // ... 복잡한 로직

  return (
    <div>
      <GreetingSection user={data?.user} />
      <InfoCardsGrid stats={data?.stats} />
      <RoadmapList filter={filter} onFilterChange={setFilter} />
    </div>
  );
}
```

### 4.2 모든 페이지 적용

```typescript
// app/signin/page.tsx
import { SigninContent } from '@/feature/auth';
export default function SigninPage() {
  return <SigninContent />;
}

// app/my-roadmaps/page.tsx
import { MyRoadmapsContent } from '@/feature/roadmap';
export default function MyRoadmapsPage() {
  return <MyRoadmapsContent />;
}
```

---

## Phase 5: 테스트 설정

### 5.1 test 디렉토리 생성

```bash
mkdir -p src/test/utils
mkdir -p src/test/mocks
```

### 5.2 테스트 유틸리티 생성

```typescript
// src/test/utils/test-utils.tsx
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactElement } from 'react';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient;
}

export function renderWithProviders(
  ui: ReactElement,
  { queryClient = createTestQueryClient(), ...options }: CustomRenderOptions = {},
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  }

  return render(ui, { wrapper: Wrapper, ...options });
}

export * from '@testing-library/react';
export { renderWithProviders as render };
```

### 5.3 MSW 설정

```typescript
// src/test/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/roadmaps', () => {
    return HttpResponse.json([
      {
        id: '1',
        name: 'Test Roadmap',
        icon: 'map',
        color: 'blue',
        type: 'personal',
        totalSteps: 10,
        completedSteps: 5,
        status: 'in-progress',
        progress: 50,
      },
    ]);
  }),
];
```

```typescript
// src/test/mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

### 5.4 테스트 작성 시작

```typescript
// src/shared/ui/Button/__tests__/Button.test.tsx
import { render, screen } from '@/test/utils/test-utils';
import { Button } from '../Button';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    screen.getByText('Click me').click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

---

## 검증 체크리스트

### Phase 1 완료 체크

- [ ] `shared/ui` 디렉토리 생성 완료
- [ ] 공통 컴포넌트 이동 완료
- [ ] `shared/api` 디렉토리 생성 완료
- [ ] API 클라이언트 이동 완료
- [ ] ApiError 클래스 생성 완료
- [ ] import 경로 수정 완료
- [ ] 빌드 성공
- [ ] 린트 통과
- [ ] 타입 체크 통과

### Phase 2 완료 체크

- [ ] `feature/roadmap` 디렉토리 생성 완료
- [ ] Roadmap 타입 통합 완료
- [ ] ROADMAP_COLORS 상수 통합 완료
- [ ] Pagination 컴포넌트 통합 (4→1)
- [ ] useDropdown 훅 통합 (2→1)
- [ ] RoadmapListItem 컴포넌트 통합 (3→1)
- [ ] FilterTabs 컴포넌트 통합 (3→1)
- [ ] Roadmap API 생성 완료
- [ ] Roadmap Hooks 생성 완료
- [ ] Public API (index.ts) 작성 완료
- [ ] 기존 파일 삭제 완료
- [ ] 빌드 성공
- [ ] 린트 통과
- [ ] 타입 체크 통과

### Phase 3 완료 체크

- [ ] `feature/auth` 생성 완료
- [ ] `feature/dashboard` 생성 완료
- [ ] `feature/team` 생성 완료
- [ ] `feature/school-connect` 생성 완료
- [ ] 각 feature Public API 작성 완료
- [ ] 빌드 성공
- [ ] 린트 통과

### Phase 4 완료 체크

- [ ] 모든 page.tsx를 얇게 만들기 완료
- [ ] 복잡한 로직을 feature로 이동 완료
- [ ] 빌드 성공
- [ ] 기능 테스트 완료

### Phase 5 완료 체크

- [ ] `test` 디렉토리 생성 완료
- [ ] 테스트 유틸리티 생성 완료
- [ ] MSW 설정 완료
- [ ] 공통 컴포넌트 테스트 작성 (최소 3개)
- [ ] 커스텀 훅 테스트 작성 (최소 2개)
- [ ] 테스트 실행 성공

### 최종 검증

- [ ] 전체 빌드 성공
- [ ] 전체 테스트 통과
- [ ] 전체 린트 통과
- [ ] 전체 타입 체크 통과
- [ ] 개발 서버 정상 실행
- [ ] 프로덕션 빌드 정상 실행
- [ ] 문서 업데이트 완료

---

## 롤백 방법

### 특정 Phase 롤백

```bash
# Phase별 커밋을 찾아서 롤백
git log --oneline | grep "Phase"

# 특정 커밋으로 롤백
git revert <commit-hash>
```

### 전체 롤백

```bash
# 백업 태그로 복원
git reset --hard backup/before-migration

# 또는 백업 브랜치로 전환
git checkout backup/current-state
```

---

## 주의사항

1. **점진적으로 진행**: 한 번에 하나의 Phase씩
2. **자주 커밋**: 작은 단위로 자주 커밋하여 롤백 가능하도록
3. **테스트 우선**: 이동 전후로 테스트 실행
4. **팀원 동기화**: 큰 변경사항은 팀원과 공유
5. **문서 업데이트**: 변경사항을 문서에 기록

---

## 추가 리소스

- [Feature-Sliced Design 공식 문서](https://feature-sliced.design/)
- [Next.js App Router 마이그레이션 가이드](https://nextjs.org/docs/app/building-your-application/upgrading)
- [Testing Library 베스트 프랙티스](https://testing-library.com/docs/react-testing-library/intro/)

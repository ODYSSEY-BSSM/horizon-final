# Team API 명세서 불일치 이슈

**작성일**: 2025-11-15
**우선순위**: 🔴 높음 (기능 동작 불가)
**관련 파일**: `src/feature/team/api/realTeamApi.ts`

---

## 문제 요약

Swagger 명세서와 프론트엔드 구현 간에 **치명적인 불일치**가 있습니다.

### Swagger 명세 (현재)

```
GET /teams
응답: {
  "teams": ["TeamA", "TeamB", "TeamC"]  // string[] - 팀 이름만
}
```

### 프론트엔드 필요 사항

```typescript
GET /teams
응답: TeamResponse[] = [
  {
    id: 1,
    name: "TeamA",
    leader: "user@example.com",
    inviteCode: "ABC123",
    members: ["user1", "user2"]
  },
  ...
]
```

---

## 왜 string[]만으로는 불가능한가?

### 1. 팀 ID를 알 수 없음
- 팀 이름만 있고 ID가 없음
- `GET /teams/{id}` 호출 불가 (ID를 모르므로)
- 팀 이름으로 조회하는 API 없음 (`GET /teams/by-name` 같은 엔드포인트 없음)

### 2. 필수 정보 접근 불가
프론트엔드가 **반드시** 필요한 정보:
- `id` - 팀 상세 페이지 라우팅 (`/team-space/{teamId}`)
- `inviteCode` - 팀 초대 기능
- `members` - 멤버 수 표시
- `leader` - 팀장 표시

### 3. UI 컴포넌트가 동작하지 않음
- `TeamDropdown` - 팀 ID로 라우팅 필요
- `FolderGrid` - 팀 ID로 폴더 조회 필요
- `InviteTeamModal` - 초대 코드 표시 필요
- `useTeamSpaceData` - 멤버 수, 초대 코드 등 필요

---

## 현재 임시 해결책

```typescript
// src/feature/team/api/realTeamApi.ts
export const realTeamApi = {
  getTeams: async (): Promise<TeamResponse[]> => {
    // Swagger와 다르게 TeamResponse[]를 기대
    // 실제 백엔드가 TeamResponse[]를 반환한다면 정상 동작
    // 만약 string[]를 반환한다면 런타임 에러 발생
    return apiClient.get<TeamResponse[]>('/teams');
  },
};
```

---

## 요청 사항

### 옵션 A: 백엔드 API 수정 (권장)

**변경 전**:
```json
GET /teams
{
  "teams": ["TeamA", "TeamB"]
}
```

**변경 후**:
```json
GET /teams
[
  {
    "id": 1,
    "name": "TeamA",
    "leader": "user@example.com",
    "inviteCode": "ABC123",
    "members": ["user1", "user2", "user3"]
  },
  {
    "id": 2,
    "name": "TeamB",
    "leader": "admin@example.com",
    "inviteCode": "XYZ789",
    "members": ["user4", "user5"]
  }
]
```

**장점**:
- 프론트엔드에서 추가 API 호출 불필요
- 성능 향상 (N+1 쿼리 방지)
- 사용자 경험 개선 (빠른 로딩)

### 옵션 B: 팀 이름으로 조회하는 API 추가

새 엔드포인트 추가:
```
GET /teams/by-name/{name}
응답: TeamResponse
```

**문제점**:
- 여전히 N+1 쿼리 문제 (팀 10개면 11번 API 호출)
- 성능 저하
- 불필요한 복잡성

### 옵션 C: Swagger 명세서만 수정

실제로 백엔드가 이미 `TeamResponse[]`를 반환하고 있다면:
- Swagger 문서의 `GET /teams` 응답 스키마를 `TeamResponse[]`로 수정

---

## 영향도

### 🔴 높음
- **팀 스페이스 전체 기능 사용 불가**
- 팀 목록 조회 실패
- 팀 폴더 접근 불가
- 팀 초대 기능 동작 불가

### 영향받는 파일
```
src/app/(main)/team-space/content.tsx
src/app/(main)/team-space/[teamId]/content.tsx
src/app/(main)/team-space/[teamId]/[folderId]/content.tsx
src/feature/team/hooks/useTeamSpaceData.ts
src/feature/team/hooks/useTeamQueries.ts
src/feature/team/components/TeamDropdown/*
```

---

## 검증 방법

### 1. 실제 API 응답 확인
```bash
curl -X GET http://localhost:8080/teams \
  -H "Authorization: Bearer {your_token}" \
  -H "Content-Type: application/json"
```

### 2. 응답 확인
- `string[]`이면: 백엔드 수정 필요 (옵션 A)
- `TeamResponse[]`이면: Swagger 문서만 수정 (옵션 C)

---

## 권장 조치

1. **즉시**: 실제 백엔드 API 응답 확인
2. **우선**: 옵션 A (API 수정) 또는 옵션 C (Swagger 수정)
3. **최종**: 프론트엔드 타입 정의 검증

---

## 관련 이슈

- Swagger 문서: https://raw.githubusercontent.com/leegunwoooo/swagger-ui/refs/heads/master/swagger.json
- 이전 분석: `docs/problem_swagger.md` (3. Team API 응답 구조 불일치)

---

**담당자**: Backend Team
**예상 소요 시간**: 1-2시간
**완료 기한**: 최대한 빨리 (기능 차단 이슈)

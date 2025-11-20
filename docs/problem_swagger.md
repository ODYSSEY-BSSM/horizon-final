# Swagger API 명세서 vs 코드베이스 차이점 분석

**분석 날짜**: 2025-11-15
**분석 대상**: Horizon 프로젝트 API 구현
**Swagger 명세서**:

---

## 📊 전체 요약

### ✅ 구현 완료 현황
- Swagger 명세서의 **모든 엔드포인트가 코드베이스에 정상 구현됨**
- 핵심 API 기능 (인증, 사용자, 로드맵, 노드, 팀, 디렉토리, 문제) 완전 구현

### ⚠️ 발견된 문제점
1. **명세서에 없는 추가 엔드포인트**: 6개
2. **응답 구조 불일치**: 1건
3. **불완전한 타입 정의**: 2건 (Subject, Icon Enum)

---

## 🚨 주요 문제점

### 1. School API - 명세서에 없는 엔드포인트 (4개)

**파일**: `src/feature/school/api/realSchoolApi.ts`

#### 코드베이스에만 존재하는 엔드포인트

| 메서드 | 엔드포인트 | 함수명 | 라인 | Swagger |
|--------|-----------|--------|------|---------|
| GET | `/schools/connected` | `getConnectedSchool` | 16 | ❌ 없음 |
| DELETE | `/schools/connected` | `disconnectSchool` | 19 | ❌ 없음 |
| GET | `/schools/education-nodes` | `getEducationNodes` | 23 | ❌ 없음 |
| GET | `/schools/education-nodes/{nodeId}` | `getEducationNode` | 27 | ❌ 없음 |
| PUT | `/users/school` | `connectSchool` | 11 | ✅ 있음 |

#### 문제 설명
- 학교 연결/해제 및 교육 노드 조회 기능이 구현되어 있음
- API 명세서에는 학교 연결(`PUT /users/school`)만 정의됨
- 연결된 학교 조회, 해제, 교육 노드 관련 4개 엔드포인트가 명세서에 누락

#### 영향도
- **중간**: 학교 기능 사용 시 API 문서와 실제 동작 불일치
- 프론트엔드 개발자가 명세서만 보고 구현 시 혼란 가능

#### 권장 조치
- [ ] 백엔드 팀에 4개 엔드포인트 Swagger 명세서 추가 요청
- [x] 또는 사용하지 않는 엔드포인트라면 코드에서 제거

---

### 2. Team API - 명세서에 없는 엔드포인트 (2개)

**파일**: `src/feature/team/api/realTeamApi.ts`

#### 코드베이스에만 존재하는 엔드포인트

| 메서드 | 엔드포인트 | 함수명 | 라인 | Swagger |
|--------|-----------|--------|------|---------|
| DELETE | `/teams/{teamId}/leave` | `leaveTeam` | 35 | ❌ 없음 |
| DELETE | `/teams/{teamId}/members/{memberId}` | `removeMember` | 39 | ❌ 없음 |

#### 문제 설명
- 팀 탈퇴 및 멤버 제거 기능이 구현되어 있음
- API 명세서에는 해당 엔드포인트가 정의되지 않음

#### 영향도
- **중간**: 팀 관리 기능 일부가 문서화되지 않음

#### 권장 조치
- [ ] 실제 사용 여부 확인
- [ ] 사용 중이라면 Swagger 명세서에 추가
- [ ] 미사용이라면 코드에서 제거

---

### 3. Team API 응답 구조 불일치 ⚠️

**파일**: `src/feature/team/api/realTeamApi.ts:10-12`

#### 코드 구현
```typescript
getTeams: async (): Promise<TeamResponse[]> => {
  const response = await apiClient.get<{ teams: TeamResponse[] }>('/teams');
  return response.teams;  // 중첩된 객체에서 teams 배열 추출
}
```

#### Swagger 명세서
- **응답 형식**: `TeamResponse[]` (직접 배열 반환)

#### 문제 설명
- **코드 기대값**: `{ teams: TeamResponse[] }` (객체로 감싸진 배열)
- **Swagger 명세**: `TeamResponse[]` (직접 배열)
- 실제 API 응답 형식에 따라 런타임 에러 발생 가능

#### 영향도
- **높음**: 런타임에 팀 목록 조회 시 오류 가능성
- 데이터 파싱 실패로 인한 기능 장애 가능

#### 권장 조치
- [ ] **즉시**: 실제 백엔드 API 응답 형식 확인
- [ ] Swagger가 맞다면: 코드 수정 (`response.teams` → `response`)
- [ ] 코드가 맞다면: Swagger 명세서 수정

#### 테스트 방법
```typescript
// 실제 API 호출 후 응답 구조 확인
const response = await fetch('/teams');
const data = await response.json();
console.log(data); // { teams: [...] } or [...] ?
```

---

### 4. Subject Enum 불완전 🔴 (심각)

**파일**: `src/shared/api/types.ts:77-86`

#### 현재 코드 (8개)
```typescript
export enum Subject {
  AI_GENERAL = 'AI_GENERAL',
  AI_MATHEMATICS = 'AI_MATHEMATICS',
  AI_PROGRAMMING = 'AI_PROGRAMMING',
  DATA_STRUCTURES = 'DATA_STRUCTURES',
  ALGORITHMS = 'ALGORITHMS',
  WEB_PROGRAMMING = 'WEB_PROGRAMMING',
  DATABASE = 'DATABASE',
  SOFTWARE_ENGINEERING = 'SOFTWARE_ENGINEERING',
}
```

#### Swagger 명세서 (47개)
```
MATH_AND_AI
JAVA_PROGRAMMING
WEB_PROGRAMMING
OPERATING_SYSTEM
DATABASE_SYSTEM
COMPUTER_NETWORK
SOFTWARE_ENGINEERING
COMPUTER_GRAPHICS
ARTIFICIAL_INTELLIGENCE
MACHINE_LEARNING
DEEP_LEARNING
NATURAL_LANGUAGE_PROCESSING
COMPUTER_VISION
DATA_MINING
BIG_DATA
CLOUD_COMPUTING
... (총 47개)
```

#### 문제 설명
- **39개의 교육 과목이 누락**됨
- 교육 노드 변환 API (`PATCH /roadmap/{roadmapId}/nodes/{nodeId}`)에서 사용 불가

#### 영향도
- **매우 높음**: 교육 노드 기능 대부분 사용 불가
- 타입 안정성 저하 (서버는 47개 지원, 클라이언트는 8개만 인식)

#### 권장 조치
- [ ] **즉시**: Swagger에서 전체 47개 과목 목록 추출
- [ ] `Subject` enum에 누락된 39개 과목 추가
- [ ] 기존 코드에서 Subject 사용하는 부분 검증

---

### 5. Icon Enum 불완전

**파일**: `src/shared/api/types.ts:39-56`

#### 현재 코드 (16개)
```typescript
export enum Icon {
  LANGUAGE = 'LANGUAGE',
  CODE = 'CODE',
  SHIELD = 'SHIELD',
  DATABASE = 'DATABASE',
  HOST = 'HOST',
  HTML = 'HTML',
  CSS = 'CSS',
  JAVASCRIPT = 'JAVASCRIPT',
  REACT = 'REACT',
  VUE = 'VUE',
  ANGULAR = 'ANGULAR',
  NODE = 'NODE',
  PYTHON = 'PYTHON',
  JAVA = 'JAVA',
  CPP = 'CPP',
  GO = 'GO',
}
```

#### Swagger 명세서
- 더 많은 아이콘 타입 지원 가능성 있음
- 정확한 전체 목록 확인 필요

#### 문제 설명
- 노드 생성/수정 시 사용 가능한 아이콘이 제한될 수 있음
- Swagger에 추가 아이콘이 있다면 사용 불가

#### 영향도
- **낮음**: 기본 아이콘으로 대부분 커버 가능
- 확장성 제한

#### 권장 조치
- [ ] Swagger에서 전체 아이콘 목록 확인
- [ ] 누락된 아이콘 타입 추가

---

## ✅ 정상 구현된 API

모든 Swagger 명세서 엔드포인트가 코드베이스에 구현되어 있습니다.

### Authentication
- ✅ `POST /auth` - 로그인
- ✅ `DELETE /auth` - 로그아웃
- ✅ `PUT /auth/token` - 토큰 갱신

### Users
- ✅ `POST /users` - 회원가입
- ✅ `GET /users` - 프로필 조회
- ✅ `PUT /users` - 비밀번호 변경
- ✅ `DELETE /users` - 회원 탈퇴
- ✅ `PUT /users/school` - 학교 연결

### Verification
- ✅ `POST /verification` - 인증 코드 전송
- ✅ `PATCH /verification` - 이메일 인증
- ✅ `POST /verification/password` - 비밀번호 재설정 코드 전송
- ✅ `PUT /verification` - 비밀번호 재설정 인증

### Roadmaps
- ✅ `GET /roadmap` - 로드맵 목록 조회
- ✅ `POST /roadmap` - 로드맵 생성
- ✅ `PUT /roadmap/{id}` - 로드맵 수정
- ✅ `DELETE /roadmap/{id}` - 로드맵 삭제
- ✅ `POST /roadmap/{id}/favorite` - 즐겨찾기 토글
- ✅ `GET /roadmap/last-accessed` - 최근 접근 로드맵
- ✅ `GET /roadmap/count` - 로드맵 개수

### Nodes
- ✅ `GET /roadmap/{roadmapId}/nodes` - 노드 목록
- ✅ `POST /roadmap/{roadmapId}/nodes` - 노드 생성
- ✅ `GET /roadmap/{roadmapId}/nodes/{nodeId}` - 노드 조회
- ✅ `PUT /roadmap/{roadmapId}/nodes/{nodeId}` - 노드 수정
- ✅ `DELETE /roadmap/{roadmapId}/nodes/{nodeId}` - 노드 삭제
- ✅ `PATCH /roadmap/{roadmapId}/nodes/{nodeId}` - 교육 노드 변환

### Teams
- ✅ `GET /teams` - 팀 목록 조회
- ✅ `POST /teams` - 팀 생성
- ✅ `GET /teams/{id}` - 팀 상세 조회
- ✅ `DELETE /teams/{id}` - 팀 삭제
- ✅ `PATCH /teams` - 팀 가입 (초대 코드)

### Team Roadmaps
- ✅ `GET /teams/{teamId}/roadmap` - 팀 로드맵 목록
- ✅ `POST /teams/{teamId}/roadmap` - 팀 로드맵 생성

### Directories
- ✅ `POST /directories` - 개인 디렉토리 생성
- ✅ `PUT /directories/{directoryId}` - 디렉토리 수정
- ✅ `DELETE /directories/{directoryId}` - 디렉토리 삭제
- ✅ `POST /directories/team/{teamId}` - 팀 디렉토리 생성
- ✅ `PUT /directories/{directoryId}/team/{teamId}` - 팀 디렉토리 수정
- ✅ `DELETE /directories/{directoryId}/team/{teamId}` - 팀 디렉토리 삭제

### Problems
- ✅ `POST /{nodeId}/problems` - 문제 생성
- ✅ `PATCH /{nodeId}/problems` - 문제 해결

### Root Content
- ✅ `GET /root` - 개인 루트 디렉토리
- ✅ `GET /root/team` - 팀 루트 디렉토리

---

## 📋 우선순위별 조치 계획

### 🔴 우선순위 높음 (즉시 처리)

#### 1. Subject Enum 완성
**영향**: 교육 노드 기능 사용 불가
**작업**: `src/shared/api/types.ts:77-86`

```typescript
export enum Subject {
  // 기존 8개
  AI_GENERAL = 'AI_GENERAL',
  AI_MATHEMATICS = 'AI_MATHEMATICS',
  AI_PROGRAMMING = 'AI_PROGRAMMING',
  DATA_STRUCTURES = 'DATA_STRUCTURES',
  ALGORITHMS = 'ALGORITHMS',
  WEB_PROGRAMMING = 'WEB_PROGRAMMING',
  DATABASE = 'DATABASE',
  SOFTWARE_ENGINEERING = 'SOFTWARE_ENGINEERING',

  // 추가 필요 (Swagger에서 추출)
  MATH_AND_AI = 'MATH_AND_AI',
  JAVA_PROGRAMMING = 'JAVA_PROGRAMMING',
  OPERATING_SYSTEM = 'OPERATING_SYSTEM',
  DATABASE_SYSTEM = 'DATABASE_SYSTEM',
  COMPUTER_NETWORK = 'COMPUTER_NETWORK',
  COMPUTER_GRAPHICS = 'COMPUTER_GRAPHICS',
  ARTIFICIAL_INTELLIGENCE = 'ARTIFICIAL_INTELLIGENCE',
  MACHINE_LEARNING = 'MACHINE_LEARNING',
  DEEP_LEARNING = 'DEEP_LEARNING',
  NATURAL_LANGUAGE_PROCESSING = 'NATURAL_LANGUAGE_PROCESSING',
  COMPUTER_VISION = 'COMPUTER_VISION',
  DATA_MINING = 'DATA_MINING',
  BIG_DATA = 'BIG_DATA',
  CLOUD_COMPUTING = 'CLOUD_COMPUTING',
  // ... 나머지 과목 추가
}
```

**담당자**: Frontend Team
**예상 소요 시간**: 30분
**완료 기한**: 2025-11-16

---

#### 2. Team API 응답 구조 검증 및 수정
**영향**: 팀 목록 조회 런타임 에러 가능
**작업**: 실제 API 응답 확인 후 수정

**Step 1**: 실제 API 응답 확인
```bash
curl -X GET http://localhost:8080/teams \
  -H "Authorization: Bearer {token}"
```

**Step 2-A**: Swagger가 맞다면 코드 수정
```typescript
// src/feature/team/api/realTeamApi.ts:10-12
getTeams: async (): Promise<TeamResponse[]> => {
  return apiClient.get<TeamResponse[]>('/teams'); // 직접 반환
}
```

**Step 2-B**: 코드가 맞다면 Swagger 수정 요청
- 백엔드 팀에 Swagger 명세서 수정 요청
- 응답 형식을 `{ teams: TeamResponse[] }`로 변경

**담당자**: Frontend Team (확인), Backend Team (Swagger 수정)
**예상 소요 시간**: 1시간
**완료 기한**: 2025-11-16

---

### 🟡 우선순위 중간 (이번 주 내 처리)

#### 3. School API 엔드포인트 정리
**작업**: 추가 엔드포인트 사용 여부 확인 및 정리

**Option A**: Swagger 명세서에 추가 (사용 중인 경우)
- 백엔드 팀에 4개 엔드포인트 Swagger 추가 요청
  - `GET /schools/connected`
  - `DELETE /schools/connected`
  - `GET /schools/education-nodes`
  - `GET /schools/education-nodes/{nodeId}`

**Option B**: 코드에서 제거 (미사용인 경우)
- `src/feature/school/api/realSchoolApi.ts`에서 4개 함수 제거
- 관련 타입 정의 제거
- 호출하는 컴포넌트 있는지 확인 후 제거

**담당자**: Frontend Team + Backend Team
**예상 소요 시간**: 2시간
**완료 기한**: 2025-11-18

---

#### 4. Team API 추가 엔드포인트 정리
**작업**: `leaveTeam`, `removeMember` 사용 여부 확인

**확인 사항**:
- [ ] `leaveTeam` 함수 호출하는 컴포넌트 존재 여부
- [ ] `removeMember` 함수 호출하는 컴포넌트 존재 여부

**Option A**: Swagger에 추가 (사용 중인 경우)
```yaml
# Swagger 추가 요청 내용
DELETE /teams/{teamId}/leave
DELETE /teams/{teamId}/members/{memberId}
```

**Option B**: 코드에서 제거 (미사용인 경우)
```typescript
// src/feature/team/api/realTeamApi.ts
// Line 35-37, 39-41 삭제
```

**담당자**: Frontend Team + Backend Team
**예상 소요 시간**: 1시간
**완료 기한**: 2025-11-18

---

### 🟢 우선순위 낮음 (필요시 처리)

#### 5. Icon Enum 확인 및 업데이트
**작업**: Swagger에서 전체 아이콘 목록 확인

**Step 1**: Swagger 명세서에서 Icon enum 전체 목록 추출
**Step 2**: 누락된 아이콘이 있다면 `src/shared/api/types.ts`에 추가
**Step 3**: UI에서 새 아이콘 사용 가능하도록 아이콘 컴포넌트 업데이트

**담당자**: Frontend Team
**예상 소요 시간**: 1시간
**완료 기한**: 필요시

---

## 🔍 검증 체크리스트

### Subject Enum 수정 후 검증
- [ ] 47개 과목이 모두 추가되었는지 확인
- [ ] 기존 8개 과목 값이 변경되지 않았는지 확인
- [ ] 교육 노드 변환 API 테스트 (모든 과목으로 테스트)
- [ ] TypeScript 컴파일 에러 없는지 확인

### Team API 응답 구조 수정 후 검증
- [ ] 팀 목록 조회 API 실제 호출 테스트
- [ ] 응답 데이터 정상 파싱되는지 확인
- [ ] UI에서 팀 목록 정상 표시되는지 확인
- [ ] 에러 로그 없는지 확인

### 엔드포인트 정리 후 검증
- [ ] 제거한 엔드포인트 호출하는 코드 없는지 전체 검색
- [ ] 관련 타입 정의 정리 완료
- [ ] 빌드 에러 없는지 확인
- [ ] 기능 테스트 통과

---

## 📚 참고 자료

### 관련 파일
- API Client: `src/shared/api/client.ts`
- 공통 타입: `src/shared/api/types.ts`
- Auth API: `src/feature/auth/api/realAuthApi.ts`
- Roadmap API: `src/feature/roadmap/api/realRoadmapApi.ts`
- Node API: `src/feature/roadmap/api/realNodeApi.ts`
- Problem API: `src/feature/roadmap/api/realProblemApi.ts`
- Team API: `src/feature/team/api/realTeamApi.ts`
- Folder API: `src/feature/folder/api/realFolderApi.ts`
- School API: `src/feature/school/api/realSchoolApi.ts`

### 외부 문서
- Swagger 명세서: https://raw.githubusercontent.com/leegunwoooo/swagger-ui/refs/heads/master/swagger.json
- 프로젝트 아키텍처: `docs/architecture/README.md`
- API 클라이언트 가이드: `CLAUDE.md` (API & Authentication 섹션)

---

## 📞 문의 및 지원

### 담당자
- **Frontend Team**: API 클라이언트 코드 수정
- **Backend Team**: Swagger 명세서 업데이트, 실제 API 응답 확인

### 이슈 트래킹
이 문서의 각 항목에 대해 GitHub Issue를 생성하여 진행 상황을 추적하는 것을 권장합니다.

**제안 라벨**:
- `api-sync` - API 동기화 작업
- `type-definition` - 타입 정의 수정
- `documentation` - 문서 업데이트
- `priority-high` - 우선순위 높음
- `priority-medium` - 우선순위 중간

---

**최종 업데이트**: 2025-11-15
**다음 검토 예정일**: 2025-11-20 (Subject enum 수정 및 Team API 검증 완료 후)
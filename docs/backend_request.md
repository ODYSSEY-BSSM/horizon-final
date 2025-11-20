# 백엔드 팀 요청 사항

## 🚨 긴급: Team API 응답 형식 확인 및 수정 요청

---

## TL;DR (요약)

**현재 Swagger**: `GET /teams` → `{ teams: ["팀이름1", "팀이름2"] }`
**필요한 응답**: `GET /teams` → `[{ id: 1, name: "팀이름1", ... }, { id: 2, name: "팀이름2", ... }]`

**이유**: 팀 이름만으로는 ID를 알 수 없어서 팀 스페이스 전체 기능이 동작 불가

---

## 1️⃣ 즉시 확인 필요: 실제 API가 뭘 반환하는지

### 현재 Swagger 명세
```yaml
GET /teams
responses:
  200:
    schema:
      type: object
      properties:
        teams:
          type: array
          items:
            type: string  # ⚠️ 문자열 배열
```

### 실제 API 테스트 부탁드립니다
```bash
# 실제 응답이 어떤지 확인 부탁드립니다
curl -X GET http://localhost:8080/teams \
  -H "Authorization: Bearer {토큰}"
```

**질문**: 실제 응답이 아래 중 어느 것인가요?

**A. 문자열 배열** (Swagger 명세대로)
```json
{
  "teams": ["팀A", "팀B", "팀C"]
}
```

**B. 객체 배열** (프론트엔드 필요)
```json
[
  {
    "id": 1,
    "name": "팀A",
    "leader": "user@example.com",
    "inviteCode": "ABC123",
    "members": ["user1", "user2"]
  },
  ...
]
```

---

## 2️⃣ 만약 A라면: API 수정 요청 (권장)

### 현재 문제점

1. **팀 ID를 알 수 없음**
   - 프론트: `/team-space/{teamId}` 라우팅 필요
   - 팀 이름만 있고 ID가 없음
   - `GET /teams/{id}` 호출 불가능 (ID를 모르니까)

2. **이름으로 조회하는 API 없음**
   - `GET /teams/by-name/{name}` 같은 엔드포인트 없음
   - 팀 이름 → 팀 ID 변환 방법 없음

3. **필수 정보 접근 불가**
   - `inviteCode` 없음 → 팀 초대 기능 불가
   - `members` 없음 → 멤버 수 표시 불가
   - `leader` 없음 → 팀장 표시 불가

### 요청 사항: API 응답 수정

**변경 전**:
```java
@GetMapping("/teams")
public ResponseEntity<TeamListResponse> getTeams() {
    List<String> teamNames = teamService.getTeamNames();
    return ResponseEntity.ok(new TeamListResponse(teamNames));
}
```

**변경 후**:
```java
@GetMapping("/teams")
public ResponseEntity<List<TeamResponse>> getTeams() {
    List<TeamResponse> teams = teamService.getUserTeams();
    return ResponseEntity.ok(teams);
}
```

**응답 예시**:
```json
[
  {
    "id": 1,
    "name": "개발팀",
    "leader": "admin@example.com",
    "inviteCode": "ABC123XYZ",
    "members": ["user1@example.com", "user2@example.com", "user3@example.com"]
  },
  {
    "id": 2,
    "name": "디자인팀",
    "leader": "designer@example.com",
    "inviteCode": "DEF456UVW",
    "members": ["user4@example.com", "user5@example.com"]
  }
]
```

### 장점
- ✅ 프론트에서 추가 API 호출 불필요
- ✅ 성능 향상 (N+1 쿼리 방지)
- ✅ 빠른 로딩 (1번 API 호출로 모든 정보 획득)
- ✅ 사용자 경험 개선

---

## 3️⃣ 대안: 팀 이름으로 조회 API 추가 (비권장)

만약 API 수정이 어렵다면, 이 방법도 가능은 합니다:

```java
@GetMapping("/teams/by-name/{name}")
public ResponseEntity<TeamResponse> getTeamByName(@PathVariable String name) {
    TeamResponse team = teamService.getTeamByName(name);
    return ResponseEntity.ok(team);
}
```

**문제점**:
- ❌ 팀 10개면 11번 API 호출 필요 (1번 목록 + 10번 개별)
- ❌ 성능 저하
- ❌ 로딩 시간 증가

**그래서 권장하지 않습니다!**

---

## 4️⃣ 만약 B라면: Swagger 문서만 수정

실제로 이미 `TeamResponse[]`를 반환하고 있다면:

```yaml
# Swagger 명세 수정
GET /teams
responses:
  200:
    schema:
      type: array
      items:
        $ref: '#/definitions/TeamResponse'  # ✅ 이렇게 수정
```

이 경우 **코드 수정 불필요**, Swagger 문서만 업데이트하면 끝!

---

## 5️⃣ 영향도

### 🔴 높음 - 현재 동작 불가능한 기능들

1. **팀 스페이스 메인 페이지**
   - 팀 목록 표시 불가
   - 팀 선택 드롭다운 동작 불가

2. **팀 폴더 페이지** (`/team-space/{teamId}`)
   - 라우팅 불가 (팀 ID를 모름)
   - 팀 폴더 목록 조회 불가

3. **팀 초대 기능**
   - 초대 코드 표시 불가
   - 초대 링크 생성 불가

4. **팀 정보 표시**
   - 팀장 정보 표시 불가
   - 멤버 수 표시 불가

---

## 6️⃣ 요청 타임라인

| 단계 | 내용 | 예상 시간 |
|------|------|-----------|
| 1 | 실제 API 응답 확인 (curl 테스트) | 5분 |
| 2 | 수정 방향 결정 (위 옵션 중 선택) | 10분 |
| 3 | 코드 수정 및 테스트 | 1-2시간 |
| 4 | Swagger 문서 업데이트 | 30분 |

**총 예상 시간**: 2-3시간
**우선순위**: 🔴 높음 (기능 차단 이슈)

---

## 7️⃣ 참고 자료

### 현재 Swagger 명세
https://raw.githubusercontent.com/leegunwoooo/swagger-ui/refs/heads/master/swagger.json

### 프론트엔드 코드
- 파일: `src/feature/team/api/realTeamApi.ts`
- 타입: `src/feature/team/types/teamApi.ts`

### 관련 문서
- 상세 분석: `docs/team_api_issue.md`
- 전체 API 분석: `docs/problem_swagger.md`

---

## 8️⃣ 질문/확인 사항

아래 체크리스트 확인 부탁드립니다:

- [ ] 실제 `GET /teams` API 응답 확인 완료
- [ ] 응답 형식: A (문자열 배열) / B (객체 배열)
- [ ] 수정 방향 결정: 옵션 1 (API 수정) / 옵션 2 (Swagger만 수정) / 옵션 3 (새 엔드포인트)
- [ ] 예상 완료 시점: ________

---

## 💬 연락 주세요!

궁금한 점이나 논의가 필요하면 언제든 연락주세요.

**프론트엔드 담당**: [이름]
**슬랙**: [슬랙 채널]
**이슈 트래킹**: [GitHub Issue 번호]

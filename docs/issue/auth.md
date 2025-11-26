# Auth Feature Analysis Report

> 분석 일자: 2025-11-26
> 분석 범위: `src/feature/auth/`, `src/app/(auth)/`, `src/middleware.ts`, `src/shared/api/`

---

## 목차

1. [아키텍처 개요](#아키텍처-개요)
2. [기능적 이슈](#기능적-이슈)
3. [누락된 기능](#누락된-기능)
4. [보안 취약점](#보안-취약점)
5. [코드 품질 이슈](#코드-품질-이슈)
6. [개선 권장사항](#개선-권장사항)

---

## 아키텍처 개요

### 현재 구조

```
src/feature/auth/
├── api/
│   ├── authApi.ts          # Export wrapper (re-exports realAuthApi)
│   └── realAuthApi.ts      # 실제 API 구현
├── components/
│   ├── PrimaryButton/      # 공통 버튼
│   ├── TextDivider/        # 구분선
│   ├── TokenInitializer/   # 토큰 초기화 컴포넌트
│   ├── ContinueWithGoogle.tsx  # Google OAuth 버튼
│   └── signup/             # 회원가입 전용 컴포넌트
├── hooks/
│   ├── useSignIn.ts        # 로그인/로그아웃/프로필 조회
│   ├── useSignUp.ts        # 회원가입
│   ├── useEmailForm.ts     # 이메일 폼
│   ├── useVerificationForm.ts  # 인증번호 폼
│   ├── usePasswordForm.ts  # 비밀번호 폼
│   └── useUsernameForm.ts  # 사용자명 폼
├── steps/                  # 회원가입 단계별 컴포넌트
├── store/
│   └── signupFlow.ts       # Zustand 회원가입 상태 관리
├── types/
│   ├── auth.ts            # 인증 관련 타입
│   └── signup.ts          # 회원가입 타입
├── validations/
│   └── signup.ts          # Zod 스키마
└── index.ts               # Public API
```

### 인증 흐름

1. **로그인**: Email/Password → API → Token 저장 (Cookie + In-memory)
2. **회원가입**: Email → Verification → Password → Username → API
3. **토큰 관리**: Access Token + Refresh Token (Cookie 7일 유효)
4. **자동 갱신**: 401 응답 시 자동 refresh

---

## 기능적 이슈

### 🔴 Critical

#### 1. `useLogout`, `useUserProfile` 미노출 (index.ts)

**파일**: `src/feature/auth/index.ts`

**문제**: `useSignIn.ts`에 정의된 `useLogout`, `useUserProfile` 훅이 public API에서 export되지 않음.

```typescript
// useSignIn.ts에 정의됨
export const useLogout = () => { ... }
export const useUserProfile = () => { ... }

// index.ts에서 누락
export { useLogin } from './hooks/useSignIn';
// ❌ useLogout, useUserProfile 누락
```

**영향**:
- 다른 feature에서 직접 import 경로 사용 필요 (아키텍처 규칙 위반)
- `src/shared/layout/Header/Header.tsx`에서 사용 중 (확인 필요)

**수정 방안**:
```typescript
export { useLogin, useLogout, useUserProfile } from './hooks/useSignIn';
```

---

#### 2. 로그인 성공 후 잘못된 리다이렉션

**파일**: `src/app/(auth)/signin/content.tsx:51`

**문제**: 로그인 성공 시 `/`로 리다이렉트하지만, middleware가 `/`를 `/dashboard`로 다시 리다이렉트함.

```typescript
// signin/content.tsx
router.push('/');  // ❌ 불필요한 이중 리다이렉트

// middleware.ts
if (pathname === '/') {
  return NextResponse.redirect(new URL('/dashboard', request.url));
}
```

**영향**: 불필요한 네트워크 요청 및 사용자 경험 저하

**수정 방안**:
```typescript
router.push('/dashboard');  // ✅ 직접 dashboard로 이동
```

---

#### 3. Middleware 중복 조건문

**파일**: `src/middleware.ts:13, 25`

**문제**: `isLoggedIn` 체크가 중복됨. 첫 번째 `if (!isLoggedIn)` 블록에서 return되지 않으면 `isLoggedIn`은 항상 true.

```typescript
if (!isLoggedIn) {
  // ... return 또는 redirect
}

// 이 시점에 도달하면 isLoggedIn은 항상 true
if (isLoggedIn) {  // ❌ 불필요한 조건
  // ...
}
```

**수정 방안**: 두 번째 `if (isLoggedIn)` 제거

---

### 🟡 Major

#### 4. 회원가입 완료 후 signupFlow 상태 미정리

**파일**: `src/feature/auth/hooks/useUsernameForm.ts`

**문제**: 회원가입 완료 후 `signupFlow.reset()` 미호출로 상태가 남아있음.

```typescript
const handleSubmit = async (data: UsernameFormData) => {
  // ...
  await registerMutation.mutateAsync({ ... });
  router.push('/signin');
  // ❌ signupFlow.reset() 누락
};
```

**영향**: 사용자가 다시 회원가입 페이지 방문 시 이전 데이터가 남아있을 수 있음

**수정 방안**:
```typescript
const { reset } = useSignupFlow();
// 성공 후
reset();
router.push('/signin');
```

---

#### 5. 인증번호 타이머 상태 관리 이슈

**파일**: `src/feature/auth/components/signup/SecondaryAction/SecondaryAction.tsx`

**문제**: 타이머가 컴포넌트 내부 상태로만 관리되어 페이지 이동 후 돌아오면 리셋됨.

**영향**:
- 뒤로 갔다가 다시 오면 타이머가 0부터 다시 시작
- 실제로는 서버에서 쿨다운 중일 수 있음

**권장**: 서버 응답에 재전송 가능 시간 포함 또는 전역 상태로 관리

---

#### 6. Error Boundary 설정 미흡

**파일**: `src/app/(auth)/signin/error.tsx`, `src/app/(auth)/signup/error.tsx`

**문제**:
- 에러 페이지가 동일한 `GeneralErrorPage` 사용
- 인증 특화 에러 처리 없음 (예: "이미 가입된 이메일", "만료된 인증번호" 등)

**권장**: 인증 관련 에러에 대한 구체적인 UI 및 액션 제공

---

### 🟠 Minor

#### 7. Dev 환경 인증번호 우회 미구현

**파일**: `src/feature/auth/hooks/useVerificationForm.ts`

**문제**: `.env`에 `NEXT_PUBLIC_DEV_VERIFICATION_CODE`가 정의되어 있지만 실제 사용되지 않음.

**권장**: 개발 환경에서 테스트 용이성을 위해 우회 코드 구현

---

#### 8. ContinueWithGoogle 컴포넌트 미완성

**파일**: `src/feature/auth/components/ContinueWithGoogle.tsx`

**문제**: Google OAuth가 TODO 상태로 비활성화됨.

```typescript
// signin/content.tsx
const handleGoogleLogin = () => {
  // TODO: Google OAuth 흐름 구현 필요
};
<ContinueWithGoogle onClick={handleGoogleLogin} disabled />
```

**상태**: 의도된 미구현 (TODO 표시)

---

## 누락된 기능

### 1. 비밀번호 찾기/재설정

**현재 상태**: API만 존재 (`requestPasswordResetCode`, `verifyPasswordUpdate`, `changePassword`)

**누락된 것**:
- UI 컴포넌트 없음
- 라우트 없음 (`/forgot-password`, `/reset-password`)
- 관련 hooks 없음

---

### 2. 로그인 유지 기능 (Remember Me)

**현재 상태**: 없음

**영향**: 쿠키가 7일 후 만료되면 자동 로그아웃

**권장**: "로그인 유지" 체크박스 및 장기 토큰 옵션

---

### 3. 세션 관리

**현재 상태**: 없음

**누락된 것**:
- 다중 기기 로그인 관리
- 활성 세션 목록
- 다른 기기에서 로그아웃

---

### 4. 이메일 중복 체크 (실시간)

**현재 상태**: 회원가입 제출 시에만 확인

**권장**: 이메일 입력 중 실시간 중복 확인 API 및 UI

---

### 5. 비밀번호 강도 표시기

**현재 상태**: 조건 충족 여부만 표시 (8자, 숫자, 특수문자)

**권장**: 시각적 강도 표시기 (weak/medium/strong)

---

### 6. 소셜 로그인 (Google 외)

**현재 상태**: Google만 버튼 존재 (미구현)

**누락**: Apple, Kakao, Naver 등

---

### 7. 토큰 만료 알림

**현재 상태**: 401 발생 시 자동 갱신 또는 로그아웃

**권장**: 세션 만료 임박 시 사용자에게 알림 및 연장 옵션

---

## 보안 취약점

### 🔴 High Priority

#### 1. Cookie 보안 설정 부족

**파일**: `src/shared/api/tokenStore.ts`

**현재 설정**:
```typescript
const cookieOptions = {
  expires: 7,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
};
```

**문제**: `httpOnly: false` (기본값)

**영향**: XSS 공격 시 JavaScript로 토큰 접근 가능

**권장**:
```typescript
httpOnly: true,  // JS 접근 차단
path: '/',       // 경로 제한
```

> **참고**: `httpOnly`를 사용하려면 서버 측 쿠키 설정이 필요하며, 클라이언트에서 `js-cookie`로는 설정 불가. API 응답의 `Set-Cookie` 헤더 활용 필요.

---

#### 2. Access Token 메모리 노출

**파일**: `src/shared/api/tokenStore.ts`, `src/shared/api/client.ts`

**문제**: Access Token이 클래스 인스턴스 변수로 저장되어 DevTools에서 접근 가능.

**권장**: Closure를 활용한 private 변수 또는 Web Worker 활용

---

### 🟡 Medium Priority

#### 3. Rate Limiting 없음 (클라이언트)

**영향**: 인증번호 요청, 로그인 시도에 대한 클라이언트 측 제한 없음

**권장**:
- 로그인 실패 횟수 추적 및 지연
- 인증번호 요청 쿨다운 (서버 동기화)

---

#### 4. 민감 정보 콘솔 로깅

**파일**: 전반적으로 `console.log` 사용 여부 확인 필요

**권장**: Production에서 민감 정보 로깅 비활성화

---

## 코드 품질 이슈

### 1. 파일 구조 불일치

**문제**:
- `authApi.ts`가 단순히 `realAuthApi`를 re-export
- 파일 하나로 통합 가능

```typescript
// authApi.ts
export { realAuthApi as authApi } from './realAuthApi';
```

**권장**: `realAuthApi.ts` → `authApi.ts`로 리네이밍 후 단일 파일 유지

---

### 2. 중복 코드

**위치**: 각 form hook (`useEmailForm`, `useVerificationForm`, `usePasswordForm`, `useUsernameForm`)

**문제**: 에러 처리 패턴이 거의 동일

```typescript
// 반복되는 패턴
catch (error) {
  const errorMessage = error instanceof Error
    ? error.message
    : '기본 에러 메시지';
  form.setError('field', {
    type: 'manual',
    message: errorMessage,
  });
}
```

**권장**: 공통 에러 처리 유틸리티 함수 추출

---

### 3. 타입 불일치 가능성

**파일**: `src/feature/auth/types/auth.ts`

**문제**: `UserInfo.uuid`가 `number` 타입

```typescript
export interface UserInfo {
  uuid: number;  // UUID는 일반적으로 string
  // ...
}
```

**권장**: 백엔드 스키마 확인 후 `string` 또는 `number` 통일

---

### 4. Magic String 사용

**위치**: 여러 파일

```typescript
// 반복되는 문자열
queryKey: ['user', 'profile']
queryKey: ['user']
```

**권장**: Query Key 상수화

```typescript
export const AUTH_QUERY_KEYS = {
  user: ['user'] as const,
  profile: ['user', 'profile'] as const,
};
```

---

## 개선 권장사항

### 즉시 수정 필요 (P0)

| 항목 | 파일 | 설명 |
|------|------|------|
| Export 누락 | `index.ts` | `useLogout`, `useUserProfile` 추가 |
| 리다이렉트 최적화 | `signin/content.tsx` | `/dashboard`로 직접 이동 |
| 상태 정리 | `useUsernameForm.ts` | 회원가입 완료 후 `reset()` 호출 |

### 단기 개선 (P1)

| 항목 | 설명 |
|------|------|
| 비밀번호 찾기 UI | 기존 API 활용한 UI 구현 |
| Cookie 보안 강화 | `httpOnly` 설정 (서버 측) |
| 에러 처리 통합 | 공통 유틸리티 함수 |

### 중장기 개선 (P2)

| 항목 | 설명 |
|------|------|
| Rate Limiting | 클라이언트 측 시도 제한 |
| 세션 관리 | 다중 기기 관리 기능 |

---

## 참고 파일 목록

### 분석된 파일

- `src/feature/auth/index.ts`
- `src/feature/auth/api/authApi.ts`
- `src/feature/auth/api/realAuthApi.ts`
- `src/feature/auth/types/auth.ts`
- `src/feature/auth/types/signup.ts`
- `src/feature/auth/store/signupFlow.ts`
- `src/feature/auth/hooks/useSignIn.ts`
- `src/feature/auth/hooks/useSignUp.ts`
- `src/feature/auth/hooks/useEmailForm.ts`
- `src/feature/auth/hooks/useVerificationForm.ts`
- `src/feature/auth/hooks/usePasswordForm.ts`
- `src/feature/auth/hooks/useUsernameForm.ts`
- `src/feature/auth/validations/signup.ts`
- `src/feature/auth/steps/*.tsx`
- `src/feature/auth/components/**/*.tsx`
- `src/app/(auth)/**/*`
- `src/middleware.ts`
- `src/shared/api/client.ts`
- `src/shared/api/tokenStore.ts`

---

## 변경 이력

| 일자 | 버전 | 내용 |
|------|------|------|
| 2025-11-26 | 1.0 | 초기 분석 보고서 작성 |

# Horizon

> 협업 기반 로드맵 관리 플랫폼

Horizon은 팀과 함께 프로젝트 로드맵을 관리하고 실시간으로 협업할 수 있는 웹 애플리케이션입니다. 직관적인 시각화와 실시간 동기화를 통해 효율적인 프로젝트 계획 및 추적을 지원합니다.

## ✨ 주요 기능

- **🗂️ 로드맵 관리**: 프로젝트 로드맵을 생성, 편집, 관리
- **👥 팀 협업**: 팀 공간에서 멤버들과 실시간 협업
- **📁 폴더 구조**: 로드맵을 폴더로 체계적으로 정리
- **🔄 실시간 동기화**: WebSocket을 통한 실시간 데이터 업데이트
- **🏫 학교 연동**: 학교 인증 및 학교별 커뮤니티
- **🎯 대시보드**: 프로젝트 현황을 한눈에 파악

## 🛠️ 기술 스택

### Core
- **Next.js 15** - App Router, React Server Components
- **React 19** - 최신 React 기능 활용
- **TypeScript** - 타입 안정성
- **Bun** - 빠른 패키지 매니저 및 런타임

### Styling
- **Emotion** - CSS-in-JS
- **Design Tokens** - 일관된 디자인 시스템

### State Management
- **TanStack Query** - 서버 상태 관리
- **Zustand** - 클라이언트 상태 관리
- **React Hook Form + Zod** - 폼 상태 및 검증

### Real-time
- **STOMP over WebSocket** - 실시간 양방향 통신
- **@stomp/stompjs** - STOMP 프로토콜 클라이언트

### Code Quality
- **Biome** - 린팅 및 포매팅 (ESLint + Prettier 대체)
- **TypeScript Strict Mode** - 엄격한 타입 체크
- **Husky + lint-staged** - Git hooks 자동화

### Development Tools
- **Storybook** - 컴포넌트 개발 및 문서화
- **Vitest** - 테스트 프레임워크

## 🚀 시작하기

### 필수 조건

- **Bun** >= 1.0.0
- **Node.js** >= 20.0.0 (optional, Bun 런타임 사용 권장)

### 설치

1. **저장소 클론**
   ```bash
   git clone <repository-url>
   cd horizon-final
   ```

2. **의존성 설치**
   ```bash
   bun install
   ```

3. **환경 변수 설정**
   ```bash
   cp .env.example .env.local
   ```

   `.env.local` 파일을 열어 다음 환경 변수를 설정하세요:
   ```bash
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
   NEXT_PUBLIC_WS_BASE_URL=ws://localhost:8080
   NEXT_PUBLIC_DEV_VERIFICATION_CODE=080531
   ```

4. **개발 서버 실행**
   ```bash
   bun dev
   ```

   브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### HTTPS 개발 서버 (선택)

```bash
bun dev:https
```

## 📁 프로젝트 구조

```
src/
├── app/                    # Next.js App Router 페이지
│   ├── (auth)/            # 인증 페이지 (/signin, /signup)
│   └── (main)/            # 보호된 페이지 (/dashboard, /my-roadmaps, etc.)
├── feature/               # 기능 모듈 (도메인 주도)
│   ├── auth/             # 인증 기능
│   ├── dashboard/        # 대시보드
│   ├── folder/           # 폴더 관리
│   ├── roadmap/          # 로드맵 (핵심 도메인)
│   ├── school/           # 학교 연동
│   └── team/             # 팀 협업
├── shared/               # 공유 리소스
│   ├── api/              # API 클라이언트, WebSocket
│   ├── components/       # 공유 컴포넌트
│   ├── hooks/            # 재사용 가능한 훅
│   ├── layout/           # 레이아웃 컴포넌트
│   ├── providers/        # Context Providers
│   ├── tokens/           # 디자인 토큰
│   ├── types/            # 공유 타입
│   ├── ui/               # UI 컴포넌트 라이브러리
│   └── utils/            # 유틸리티 함수
└── stories/              # Storybook 스토리
```

### Feature 모듈 패턴

각 기능은 다음과 같은 구조를 따릅니다:

```
feature/<name>/
├── api/              # API 엔드포인트
├── components/       # 기능별 컴포넌트
├── hooks/            # 기능별 훅
├── store/            # 상태 관리 (Zustand)
├── types/            # 타입 정의
├── validations/      # Zod 스키마
└── index.ts          # ⭐ Public API (항상 여기서 import)
```

**중요**: 항상 feature의 `index.ts`에서 import하세요:
```typescript
// ✅ 올바른 방법
import { authApi, useLogin } from '@/feature/auth';

// ❌ 잘못된 방법
import { authApi } from '@/feature/auth/api/authApi';
```

## 🔧 개발 가이드

### 주요 명령어

```bash
# 개발 서버
bun dev                  # Next.js 개발 서버 (Turbopack)
bun dev:https            # HTTPS 개발 서버

# 코드 품질
bun lint                 # Biome 린트 체크 (읽기 전용)
bun run lint:fix         # 린트 및 포맷 자동 수정
bun run format           # 포맷 및 자동 수정
bun run lint:unsafe      # Unsafe 수정 적용 (주의)

# 빌드
bun run build            # 프로덕션 빌드
bun start                # 프로덕션 서버 실행

# Storybook
bun run storybook        # Storybook 개발 서버 (포트 6006)
```

### 코드 스타일

이 프로젝트는 **Biome**을 사용합니다:
- **라인 너비**: 100자
- **들여쓰기**: 2 스페이스
- **따옴표**: JS/TS는 작은따옴표, JSX는 큰따옴표
- **세미콜론**: 항상 사용
- **Trailing comma**: 항상 사용

### Import 순서

```typescript
// 1. React & Next.js
import { useState } from 'react';
import Link from 'next/link';

// 2. 외부 라이브러리
import { useQuery } from '@tanstack/react-query';
import styled from '@emotion/styled';

// 3. Feature 모듈 (public API)
import { authApi, useLogin } from '@/feature/auth';

// 4. 공유 리소스
import { Button } from '@/shared/ui';
import { tokens } from '@/shared/tokens';

// 5. 로컬/상대 import
import { Header } from './Header';
```

### 컴포넌트 작성 패턴

```typescript
import styled from '@emotion/styled';
import { tokens } from '@/shared/tokens';

interface Props {
  title: string;
  onSubmit: () => void;
}

export function MyComponent({ title, onSubmit }: Props) {
  return (
    <Container>
      <Title>{title}</Title>
      <Button onClick={onSubmit}>Submit</Button>
    </Container>
  );
}

const Container = styled.div`
  padding: ${tokens.spacing.md};
  background: ${tokens.colors.background};
`;

const Title = styled.h1`
  font-size: ${tokens.typography.fontSize.xl};
  color: ${tokens.colors.text.primary};
`;
```

### API 호출 패턴

```typescript
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/feature/auth';

function LoginForm() {
  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      console.log('로그인 성공', data);
    },
    onError: (error) => {
      console.error('로그인 실패', error);
    },
  });

  const handleSubmit = (credentials: LoginRequest) => {
    loginMutation.mutate(credentials);
  };

  return (
    // ...
  );
}
```

### WebSocket 사용 패턴

```typescript
import { useEffect } from 'react';
import { getStompClient } from '@/shared/api/stompWebSocket';

function RealtimeComponent() {
  useEffect(() => {
    const client = getStompClient();

    client.connect();

    const subscription = client.subscribe('/topic/updates', (data) => {
      console.log('받은 데이터:', data);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return (
    // ...
  );
}
```

## 📚 문서

- **[Architecture](./architecture/README.md)** - 아키텍처 상세 설명
- **[Migration Guide](./architecture/migration-guide.md)** - Feature 기반 아키텍처 마이그레이션
- **[WebSocket API](./WEBSOCKET.md)** - WebSocket 사용 가이드
- **[Troubleshooting](./TROUBLESHOOTING.md)** - 문제 해결 가이드

## 🔐 인증 흐름

1. **로그인/회원가입** → JWT 토큰 발급
2. **토큰 저장** → HTTP-only 쿠키 + 인메모리 스토어
3. **API 요청** → 자동으로 Access Token 포함
4. **토큰 만료** → 자동으로 Refresh Token으로 갱신
5. **로그아웃** → 토큰 삭제 및 리다이렉트

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit 메시지 컨벤션

- `feat:` 새로운 기능
- `fix:` 버그 수정
- `docs:` 문서 변경
- `style:` 코드 포맷팅 (기능 변경 없음)
- `refactor:` 코드 리팩토링
- `test:` 테스트 추가/수정
- `chore:` 빌드/설정 변경

## 📄 라이선스

This project is licensed under the MIT License.

## 👥 팀

ODYSSEY-BSSM Team

---

**Made with ❤️ by Horizon Team**

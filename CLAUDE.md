# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Horizon is a **Next.js 15** (App Router) application built with **React 19**, **TypeScript**, and **Emotion** for styling. The project uses a feature-based architecture with centralized shared resources and implements real-time communication via **STOMP WebSocket**.

**Package Manager**: This project uses **Bun** as the package manager. Always use `bun` commands, not `npm` or `yarn`.

## Essential Development Commands

### Development
```bash
bun dev              # Start Next.js dev server with Turbopack
bun dev:https        # Start dev server with HTTPS via local-ssl-proxy
```

### Code Quality
```bash
bun lint             # Run Biome linter checks (read-only)
bun run lint:fix     # Auto-fix linting and formatting issues
bun run format       # Format and fix all files
bun run lint:unsafe  # Apply unsafe fixes (use with caution)
```

### Build
```bash
bun run build        # Build for production
bun start            # Start production server
```

### Storybook
```bash
bun run storybook    # Start Storybook dev server on port 6006
```

### Pre-commit Hook
Husky runs `bunx lint-staged` before every commit, which runs Biome checks on staged files. All linting issues must be resolved before committing.

## Architecture Overview

### Core Directory Structure

```
src/
├── app/                    # Next.js App Router pages (route definitions only)
│   ├── (auth)/            # Public routes: /signin, /signup
│   └── (main)/            # Protected routes: /dashboard, /my-roadmaps, etc.
├── feature/               # Feature modules (domain-driven, self-contained)
│   ├── auth/             # Authentication (login, signup, tokens)
│   ├── dashboard/        # Dashboard feature
│   ├── folder/           # Folder management
│   ├── roadmap/          # Roadmap feature (core domain)
│   ├── school/           # School connection
│   └── team/             # Team collaboration
├── shared/               # Shared resources across all features
│   ├── api/              # API client, WebSocket, types
│   ├── components/       # Shared React components
│   ├── hooks/            # Reusable hooks (useDropdown, useWebSocket, etc.)
│   ├── layout/           # Layout components (Header, Sidebar)
│   ├── providers/        # React context providers (QueryProvider)
│   ├── tokens/           # Design tokens (colors, typography, spacing, etc.)
│   ├── types/            # Shared TypeScript types
│   ├── ui/               # UI component library (Button, TextField, Modal, etc.)
│   └── utils/            # Utility functions
└── stories/              # Storybook stories and examples
```

### Feature Module Pattern

Each feature follows a consistent internal structure and exports its public API through `index.ts`:

```
feature/<name>/
├── api/              # API endpoints for this feature
├── components/       # Feature-specific components
├── hooks/            # Feature-specific hooks
├── store/            # State management (Zustand)
├── types/            # Feature-specific types
├── validations/      # Zod schemas
└── index.ts          # ⭐ Public API exports (ONLY import from here)
```

**Critical Import Rule**: Always import from feature's `index.ts`, never from internal paths:
```typescript
// ✅ Correct
import { authApi, useLogin, tokenStore } from '@/feature/auth';

// ❌ Wrong
import { authApi } from '@/feature/auth/api/authApi';
```

### Dependency Direction

```
app → feature → shared
     ↘ shared ↙
```

**Rules**:
- `app` imports from `feature` and `shared`
- `feature` can import from other `feature` modules and `shared`
- `shared` is completely independent and imports nothing from `app` or `feature`
- No circular dependencies allowed

## API & Authentication

### API Client
Centralized API client at `src/shared/api/client.ts`:
- **Auto JWT authentication**: Access token from `tokenStore` included in all requests
- **Auto token refresh**: Automatically refreshes expired tokens on 401 responses
- **Standard response format**: All responses follow `ApiResponse<T>` type
- **Base URL**: `NEXT_PUBLIC_API_BASE_URL` environment variable

```typescript
interface ApiResponse<T> {
  code: string;      // 'OK' for success
  message: string;   // Human-readable message
  data: T;          // Response payload
}
```

### Authentication Flow
- **Token storage**: HTTP-only cookies (`accessToken`, `refreshToken`) + in-memory store (`tokenStore`)
- **Route protection**: `middleware.ts` handles route guards and redirects
- **Protected routes**: `/dashboard`, `/my-roadmaps`, `/school-connect`, `/team-space`
- **Public-only routes**: `/signin`, `/signup`

Token management:
```typescript
import { tokenStore } from '@/feature/auth';
tokenStore.setTokens(accessToken, refreshToken);
const token = tokenStore.getAccessToken();
tokenStore.clearTokens();
```

## WebSocket & Real-time Communication

**Primary implementation**: STOMP WebSocket (`src/shared/api/stompWebSocket.ts`) using `@stomp/stompjs`
- JWT authentication via `Authorization` header
- Auto-reconnection with exponential backoff
- Subscription management
- Base URL: `NEXT_PUBLIC_WS_BASE_URL`

**Usage**:
```typescript
import { getStompClient } from '@/shared/api/stompWebSocket';
const client = getStompClient();
client.connect();
client.subscribe('/topic/example', (data) => console.log(data));
```

**Feature-specific WebSocket hooks**:
- `useTeamDirectoryWebSocket` - Team directory changes
- `useRoadmapNodesWebSocket` - Roadmap node updates
- `useCursorWebSocket` - Cursor position sharing

See `docs/WEBSOCKET.md` for detailed WebSocket API documentation.

## State Management

- **Zustand**: Client-side state management (feature stores)
- **TanStack Query**: Server state management and caching
- **React Hook Form + Zod**: Form state and validation

## Styling & Design System

**Styling**: Uses **@emotion/react** and **@emotion/styled** for CSS-in-JS

**Design tokens** centralized in `src/shared/tokens/`:
```typescript
import styled from '@emotion/styled';
import { tokens } from '@/shared/tokens';

const StyledButton = styled.button`
  background: ${tokens.colors.primary};
  padding: ${tokens.spacing.md};
  border-radius: ${tokens.radius.sm};
`;
```

**UI component library** in `src/shared/ui/`:
- Button, TextField, Modal, Divider, Icon, Text, SkeletonView, Toast

All components have corresponding `.stories.tsx` files for Storybook.

## Code Standards

### Biome Configuration
Uses **Biome** (not ESLint/Prettier) for linting and formatting:
- **Line width**: 100 characters
- **Indentation**: 2 spaces
- **Quotes**: Single quotes for JS/TS, double quotes for JSX
- **Semicolons**: Always
- **Trailing commas**: Always

### TypeScript
- **Strict mode enabled**
- Path alias: `@/*` maps to `./src/*`
- Type all function parameters and return values
- Avoid `any` when possible (warning, not error)

### Import Organization
Follow this order:
1. React and Next.js
2. External libraries
3. Internal features (via public API)
4. Shared resources
5. Local/relative imports

### Component Patterns
- Use function components with TypeScript
- Extract reusable logic to custom hooks
- Co-locate feature-specific components in feature directories
- Place truly shared components in `src/shared/components/` or `src/shared/ui/`

## Environment Variables

Required environment variables (see `.env.example`):
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
NEXT_PUBLIC_WS_BASE_URL=ws://localhost:8080
NEXT_PUBLIC_DEV_VERIFICATION_CODE=080531  # Dev bypass code
```

For production, use HTTPS/WSS:
```bash
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
NEXT_PUBLIC_WS_BASE_URL=wss://api.yourdomain.com
```

## Key Behavioral Notes

### Next.js App Router
- Use Server Components by default
- Add `'use client'` only when necessary (hooks, events, browser APIs)
- Leverage route groups `(auth)` and `(main)` for layout organization
- Root redirect logic in `middleware.ts`, not in pages

### Type Safety
- All API calls typed with `ApiResponse<T>`
- Form schemas defined with Zod
- Zustand stores are typed
- WebSocket message handlers accept generic type `StompMessageHandler<T>`

### Error Handling
- API client throws errors for non-200 responses or non-OK codes
- Use try-catch with TanStack Query's `useMutation` for error handling
- WebSocket errors logged but don't crash the app

## Testing & Storybook

### Vitest
Testing framework configured but minimal test coverage. Config: `vitest.config.ts`

### Storybook
- Stories located in `src/stories/` and co-located with components
- Includes accessibility testing via `@storybook/addon-a11y`
- Documentation via `@storybook/addon-docs`
- Configured for Next.js with Vite builder

## Architecture Migration in Progress

The project is currently undergoing a feature-based architecture migration (see `docs/architecture/README.md`):
- **Goal**: Eliminate code duplication (~1000+ lines)
- **Pattern**: Feature-Sliced Design
- **Status**: Phase 2 - Consolidating roadmap feature module

When adding new code, follow the new feature-based pattern described in this document.

## Additional Documentation

- **Architecture details**: `docs/architecture/README.md`
- **Migration guide**: `docs/architecture/migration-guide.md`
- **WebSocket API**: `docs/WEBSOCKET.md`
- **Troubleshooting**: `docs/TROUBLESHOOTING.md`
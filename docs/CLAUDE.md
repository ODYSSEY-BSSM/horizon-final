# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Horizon is a Next.js 15 (App Router) application built with React 19, TypeScript, and Emotion for styling. The project uses a feature-based architecture with centralized shared resources and implements real-time communication via STOMP WebSocket.

## Development Commands

### Package Manager
This project uses **Bun** as the package manager. Use Bun commands for all operations:
- `bun install` - Install dependencies
- `bun add <package>` - Add a new dependency
- `bun remove <package>` - Remove a dependency

### Development
- `bun dev` - Start Next.js development server with Turbopack
- `bun dev:https` - Start development server with HTTPS via local-ssl-proxy

### Code Quality
- `bun lint` - Run Biome linter checks (read-only)
- `bun run lint:fix` - Auto-fix linting and formatting issues
- `bun run format` - Format and fix all files
- `bun run lint:unsafe` - Apply unsafe fixes (use with caution)

### Build & Production
- `bun run build` - Build for production
- `bun start` - Start production server

### Storybook
- `bun run storybook` - Start Storybook dev server on port 6006
- `bun run build-storybook` - Build static Storybook

### Pre-commit Hook
The project uses Husky to run `bun run lint` before every commit. All linting issues must be resolved before committing.

## Architecture Overview

### Directory Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Auth route group (signin, signup)
│   └── (main)/            # Protected main app routes
│       ├── dashboard/
│       ├── my-roadmaps/
│       ├── school-connect/
│       └── team-space/
├── feature/               # Feature modules (domain-driven)
│   ├── auth/             # Authentication feature
│   ├── dashboard/        # Dashboard feature
│   ├── folder/           # Folder management
│   ├── roadmap/          # Roadmap feature
│   ├── school/           # School connection
│   └── team/             # Team collaboration
├── shared/               # Shared resources across features
│   ├── api/              # API client & WebSocket
│   ├── components/       # Shared React components
│   ├── constants/        # App-wide constants
│   ├── hooks/            # Reusable hooks
│   ├── layout/           # Layout components (Header, Sidebar)
│   ├── providers/        # React context providers
│   ├── tokens/           # Design tokens (colors, typography, etc.)
│   ├── types/            # Shared TypeScript types
│   ├── ui/               # UI component library
│   └── utils/            # Utility functions
└── stories/              # Storybook stories and examples
```

### Feature Module Pattern

Each feature follows a consistent internal structure:
```
feature/<name>/
├── api/              # API endpoints for this feature
├── components/       # Feature-specific components
├── constants/        # Feature-specific constants
├── forms/            # Form components
├── hooks/            # Feature-specific hooks
├── sections/         # Page sections/layouts
├── steps/            # Multi-step flows (e.g., signup)
├── store/            # State management (Zustand)
├── types/            # Feature-specific types
├── utils/            # Feature utilities
├── validations/      # Zod schemas
└── index.ts          # Public API exports
```

**Important**: Features export their public API through `index.ts`. Import from feature modules, not internal paths:
```typescript
// ✅ Correct
import { authApi, useLogin, tokenStore } from '@/feature/auth';

// ❌ Incorrect
import { authApi } from '@/feature/auth/api/authApi';
```

### API Client Architecture

The project uses a centralized API client (`src/shared/api/client.ts`) with:
- **Automatic JWT authentication**: Access token from `tokenStore` is included in all requests
- **Token refresh on 401**: Automatically attempts to refresh expired tokens
- **Standardized response format**: All API responses follow `ApiResponse<T>` type
- **Base URL from environment**: `NEXT_PUBLIC_API_BASE_URL`

API response format:
```typescript
interface ApiResponse<T> {
  code: string;      // 'OK' for success
  message: string;   // Human-readable message
  data: T;          // Response payload
}
```

### WebSocket & Real-time Communication

Two WebSocket implementations:
1. **STOMP WebSocket** (`src/shared/api/stompWebSocket.ts`) - Primary, uses `@stomp/stompjs`
   - JWT authentication via `Authorization` header
   - Auto-reconnection with exponential backoff
   - Subscription management
   - Base URL: `NEXT_PUBLIC_WS_BASE_URL`

2. **Legacy WebSocket** (`src/shared/api/websocket.ts`) - Fallback implementation

Access STOMP client via singleton:
```typescript
import { getStompClient } from '@/shared/api/stompWebSocket';
const client = getStompClient();
client.connect();
client.subscribe('/topic/example', (data) => console.log(data));
```

### Authentication & Token Management

Authentication flow uses cookie-based JWT tokens:
- **Token storage**: Cookies (`accessToken`, `refreshToken`) + in-memory store (`tokenStore`)
- **Middleware protection**: `middleware.ts` handles route guards and redirects
- **Protected routes**: `/dashboard`, `/my-roadmaps`, `/school-connect`, `/team-space`
- **Public-only routes**: `/signin`, `/signup`
- **Token initialization**: `TokenInitializer` component syncs cookies to memory on app load

Token management via `tokenStore` (Zustand):
```typescript
import { tokenStore } from '@/feature/auth';
tokenStore.setTokens(accessToken, refreshToken);
const token = tokenStore.getAccessToken();
tokenStore.clearTokens();
```

### State Management

- **Zustand** for client-side state management (feature stores)
- **TanStack Query** for server state management and caching
- **React Hook Form** + **Zod** for form state and validation

### Design System

**Design tokens** centralized in `src/shared/tokens/`:
- `colors` - Color palette
- `gradients` - Gradient definitions
- `typos` - Typography system
- `icons` - Icon definitions
- `shadow` - Shadow styles
- `radius` - Border radius values
- `spacing` - Spacing system

**UI component library** in `src/shared/ui/`:
- Button
- TextField
- Modal
- Divider
- Icon
- Text
- SkeletonView

All components have corresponding `.stories.tsx` files for Storybook.

### Styling

Uses **@emotion/react** and **@emotion/styled** for CSS-in-JS:
```typescript
import styled from '@emotion/styled';
import { tokens } from '@/shared/tokens';

const StyledButton = styled.button`
  background: ${tokens.colors.primary};
  padding: ${tokens.spacing.md};
`;
```

## Code Standards

### Biome Configuration
The project uses **Biome** (not ESLint/Prettier) for linting and formatting:
- **Line width**: 100 characters
- **Indentation**: 2 spaces
- **Quotes**: Single quotes for JS/TS, double quotes for JSX
- **Semicolons**: Always
- **Trailing commas**: Always
- **Warnings**: `console` statements, `any` type allowed

### TypeScript
- **Strict mode enabled**
- Path alias: `@/*` maps to `./src/*`
- Type all function parameters and return values
- Avoid `any` when possible (though not enforced)

### Import Organization
Follow this import order:
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

## Testing & Storybook

### Vitest
Testing framework configured but minimal setup. Config: `vitest.config.ts`

### Storybook
- Stories located in `src/stories/` and co-located with components
- Includes accessibility testing via `@storybook/addon-a11y`
- Documentation via `@storybook/addon-docs`
- Configured for Next.js with Vite builder

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

### Performance
- Next.js 15 runs with **Turbopack** by default
- Emotion components are optimized for SSR
- TanStack Query handles caching and deduplication

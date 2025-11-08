# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Horizon is a Next.js 15 application using React 19, built with TypeScript and styled using Emotion. The project uses Bun as the package manager and includes Storybook for component development.

**Key Technologies:**
- Next.js 15.4+ with App Router and Turbopack
- React 19 with TypeScript 5
- Emotion for CSS-in-JS styling
- TanStack Query for server state management
- Zustand for client state management
- React Hook Form with Zod validation
- XYFlow for interactive flow diagrams (roadmap visualization)
- STOMP.js for WebSocket communication
- Vitest + Playwright for testing
- Storybook for component development
- Biome for linting and formatting

## Development Commands

### Running the Application
```bash
bun dev              # Start development server with Turbopack
bun run build        # Create production build
bun start            # Start production server
```

### Code Quality
```bash
bun run lint         # Check code with Biome
bun run lint:fix     # Auto-fix Biome issues (safe fixes only)
bun run lint:unsafe  # Auto-fix with unsafe transformations
bun run format       # Format and lint code
```

**Important:** The pre-commit hook runs `bun run lint` automatically. All code must pass Biome checks before committing.

### Component Development
```bash
bun run storybook        # Start Storybook dev server on :6006
bun run build-storybook  # Build static Storybook
```

Storybook is configured for:
- Components in `src/components/**/*.stories.tsx`
- Token documentation in `src/stories/tokens/**/*.stories.tsx`
- Introduction docs in `src/stories/Introduction.mdx`

### Testing
Tests use Vitest with React Testing Library and Playwright for E2E testing. Vitest configuration is minimal (see vitest.config.ts) relying on defaults.

## Architecture

### Feature-Sliced Design Structure

The codebase follows Feature-Sliced Design (FSD) architecture with clear separation:

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Auth route group (login, register)
│   ├── (main)/            # Main app routes (dashboard, my-roadmaps, team, school)
│   └── (studio)/          # Studio routes (editor, viewer)
├── features/              # Feature modules (FSD pattern)
│   ├── auth/
│   ├── problem/
│   ├── roadmap/
│   ├── team/
│   └── user/
└── shared/                # Shared/common code
    ├── api/               # Shared API utilities
    ├── common/            # Common utilities
    ├── providers/         # React context providers
    ├── store/             # Shared Zustand stores
    ├── types/             # Shared TypeScript types
    ├── ui/                # Shared UI components and tokens
    └── utils/             # Shared utility functions
```

**Feature Module Structure:**
Each feature follows a consistent internal structure:
```
features/{feature-name}/
├── api/          # API calls and data fetching
├── components/   # Feature-specific React components
├── hooks/        # Feature-specific custom hooks
├── store/        # Feature-specific Zustand stores
└── types/        # Feature-specific TypeScript types
```

### Route Groups

- **(auth)**: Unauthenticated routes with their own layout
- **(main)**: Authenticated main application routes
- **(studio)**: Roadmap editor and viewer routes (uses XYFlow)

Each route group has its own `layout.tsx`, `loading.tsx`, and `error.tsx` for proper boundaries.

### State Management Strategy

- **Server State**: TanStack Query for API data, caching, and synchronization
- **Client State**: Zustand stores for feature-specific and global client state
- **Form State**: React Hook Form with Zod schema validation
- **Real-time State**: STOMP.js WebSocket client for live updates

### Styling Approach

- **Emotion** for component-level CSS-in-JS
- **Design Tokens**: Centralized in `src/shared/ui/tokens/`
- Next.config.ts enables Emotion compiler for optimized runtime

## Code Style & Conventions

### Biome Configuration

The project uses strict Biome rules (see biome.json):

- **Formatting**: 2-space indent, 100-char line width, single quotes, semicolons, trailing commas
- **No default exports** rule is OFF (required for Next.js App Router pages)
- **Accessibility**: a11y rules enabled (except useSemanticElements)
- **Security**: noDangerouslySetInnerHtml enforced
- **React**: Hook rules strictly enforced (useHookAtTopLevel, useExhaustiveDependencies)
- **Type Safety**: noExplicitAny is OFF, but maintain strong typing where practical

### Import Path Aliases

TypeScript path alias `@/*` maps to `src/*`:
```typescript
import { Button } from '@/shared/ui/components';
import { useAuth } from '@/features/auth/hooks';
```

### Component Organization

- Feature components go in `features/{feature}/components/`
- Shared/reusable components go in `shared/ui/components/`
- Document components in Storybook when they're part of the design system
- Each component should export named exports, not default (except Next.js pages)

## Working with Features

### Adding a New Feature

1. Create feature directory: `src/features/{feature-name}/`
2. Set up subdirectories: `api/`, `components/`, `hooks/`, `store/`, `types/`
3. Add index.ts files with barrel exports where appropriate
4. Follow existing feature patterns (auth, roadmap, team, user, problem)

### API Integration

- API utilities likely in `shared/api/` (currently empty but expected)
- Axios is the HTTP client (v1.13.2)
- TanStack Query for data fetching hooks
- STOMP.js for WebSocket connections

### Forms

- React Hook Form for form state
- Zod (v4) for schema validation
- `@hookform/resolvers` for Zod integration
- Radix UI primitives for form UI (Select, Dialog, etc.)

## UI Components

### Radix UI Primitives

The project uses Radix UI headless components:
- Dialog, Dropdown Menu, Select, Toast, Tooltip
- Style with Emotion, not pre-styled components

### XYFlow for Roadmaps

`@xyflow/react` is used for interactive roadmap visualization:
- Editor and viewer routes in `(studio)` route group
- Custom nodes and edges likely in `features/roadmap/components/`

## Important Notes

- **Package Manager**: Use Bun, not npm/yarn/pnpm
- **Node Version**: Requires Node 20+ (check @types/node)
- **React 19**: Some ecosystem packages may have peer dependency warnings
- **Turbopack**: Development uses experimental Turbopack bundler
- **Husky**: Pre-commit hook enforces linting - ensure changes pass `bun run lint`
- **Empty Files**: Many newly created files are currently empty placeholders (.gitkeep, empty index.ts files)

# Shared Resources

This directory contains all shared resources used across the Horizon application.

## Overview

The `shared` directory provides:
- **API client and WebSocket infrastructure**
- **Reusable React components**
- **Custom hooks**
- **Design system (tokens)**
- **UI component library**
- **Type definitions**
- **Utility functions**
- **Layout components**
- **React providers**

## Directory Structure

```
shared/
├── api/              # API client, WebSocket, and API types
├── components/       # Shared React components
├── constants/        # Application-wide constants
├── hooks/            # Reusable custom hooks
├── layout/           # Layout components (Header, Sidebar, etc.)
├── providers/        # React context providers
├── tokens/           # Design system tokens
├── types/            # Shared TypeScript types
├── ui/               # UI component library
└── utils/            # Utility functions
```

## Key Subsystems

### API Layer (`api/`)

#### API Client (`api/client.ts`)
Centralized HTTP client with:
- Automatic JWT authentication
- Token refresh on 401 errors
- ApiError for detailed error reporting with endpoint context
- Request/response interceptors

**Usage**:
```typescript
import { apiClient } from '@/shared/api/client';

const response = await apiClient.get<User>('/users/me');
// Throws ApiError with endpoint, method, and status information
```

#### WebSocket (`api/stompWebSocket.ts`)
Primary WebSocket implementation using STOMP:
- Auto-reconnection with exponential backoff
- Subscription management
- JWT authentication
- JSON message parsing with error logging

**Usage**:
```typescript
import { getStompClient } from '@/shared/api/stompWebSocket';

const client = getStompClient();
client.connect();
client.subscribe<MessageType>('/topic/example', (data) => {
  console.log('Received:', data);
});
```

#### Error Handling (`api/errors.ts`)
Custom ApiError class with:
- HTTP status code
- API error code
- Endpoint and method information
- Helper methods: `isNetworkError()`, `isUnauthorized()`, `isServerError()`

**Error Handling Best Practice**:
```typescript
import { ApiError } from '@/shared/api/errors';

try {
  await apiClient.post('/endpoint', data);
} catch (error) {
  if (error instanceof ApiError) {
    if (error.isNetworkError()) {
      showMessage('네트워크 연결을 확인해주세요');
    } else if (error.status === 429) {
      showMessage('요청이 너무 많습니다');
    } else {
      showMessage(error.message); // Includes endpoint context
    }
  }
}
```

#### API Types (`api/types.ts`)
Common API types and enums:
- `ApiResponse<T>`: Standard API response wrapper
- `Color`, `Icon`: Roadmap/Node style enums
- `NodeType`, `ProblemStatus`, `ApplyStatus`: Domain enums

#### WebSocket Types (`api/stompTypes.ts`)
WebSocket message type definitions:
- `TeamDirectoryMessage`: Team folder updates
- `RoadmapNodeMessage`: Node creation/updates
- `CursorReceiveMessage`: Real-time cursor positions

### Design Tokens (`tokens/`)

Centralized design system values:
- **colors**: Color palette (primary, neutral, error, success, etc.)
- **gradients**: Gradient definitions
- **typos**: Typography system (font families, sizes, weights, line heights)
- **icons**: Icon definitions and mappings
- **shadow**: Box shadow styles (0-3 levels)
- **radius**: Border radius values (small, medium, large)
- **spacing**: Spacing scale (xsmall → xxlarge)

**Usage**:
```typescript
import { tokens } from '@/shared/tokens';

const StyledButton = styled.button`
  background: ${tokens.colors.primary[500]};
  padding: ${tokens.spacing.medium};
  border-radius: ${tokens.radius.medium};
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[16]};
`;
```

### UI Component Library (`ui/`)

Reusable UI components with TypeScript and Emotion styling:

#### Button (`ui/Button/`)
Flexible button component with variants, sizes, and icons:
```typescript
<Button
  variant="contained"
  size="medium"
  iconName="add"
  iconPosition="left"
>
  Add Item
</Button>
```

#### TextField (`ui/TextField/`)
Form input field with validation and error states:
```typescript
<TextField
  label="Email"
  placeholder="Enter your email"
  error={form.formState.errors.email?.message}
  {...form.register('email')}
/>
```

#### Modal (`ui/Modal/`)
Three modal variations:
- **Modal**: General-purpose modal with header, close button, and content
- **ConfirmModal**: Confirmation dialog (alert or confirm mode)
- **FormModal**: Dynamic form modal with field configuration

**Shared Styles**: All modals use `Modal.styles.ts` for consistency

```typescript
<ConfirmModal
  isOpen={isOpen}
  onClose={onClose}
  onConfirm={handleConfirm}
  title="삭제 확인"
  description="정말 삭제하시겠습니까?"
  variant="confirm"
/>
```

#### Other Components
- **Text**: Typography component with semantic variants (H1, H2, B1, etc.)
- **Icon**: SVG icon component with size variants
- **Divider**: Horizontal/vertical divider
- **SkeletonView**: Loading placeholder

### Hooks (`hooks/`)

#### useStompWebSocket
React hook for STOMP WebSocket with lifecycle management:
```typescript
const { isConnected, subscribe, send } = useStompWebSocket<MessageType>({
  endpoint: '/user/queue/messages',
  onMessage: (data) => console.log(data),
  onConnect: () => console.log('Connected'),
  onDisconnect: () => console.log('Disconnected'),
});
```
- Auto-connection on mount
- Polling interval: 2000ms (optimized for performance)
- Automatic cleanup on unmount

#### useDropdown
Dropdown menu state management:
```typescript
const {
  isOpen,
  openDropdown,
  closeDropdown,
  toggleDropdown,
  dropdownRef,
} = useDropdown();
```
- Click-outside detection
- Keyboard accessibility (Escape to close)

### Layout Components (`layout/`)

#### Header (`layout/Header/`)
Application header with:
- Logo and navigation
- User profile menu
- Notification system
- Responsive design

#### Sidebar (`layout/Sidebar/`)
Navigation sidebar with:
- Route navigation
- Active route highlighting
- Collapsible menu

### Providers (`providers/`)

React context providers for global state:
- **QueryProvider**: TanStack Query configuration
- **EmotionProvider**: Emotion CSS-in-JS setup
- **ThemeProvider**: (If applicable) Theme management

### Types (`types/`)

Shared TypeScript type definitions:
- `modal.ts`: Modal prop types
- `roadmap.ts`: Roadmap-related types (RoadmapColor, RoadmapStatus)
- Other domain-agnostic types

### Utilities (`utils/`)

Helper functions for:
- Date formatting
- String manipulation
- Validation
- Other reusable logic

## Import Guidelines

### Always Import from Shared

```typescript
// ✅ Correct - from shared
import { apiClient } from '@/shared/api/client';
import { tokens } from '@/shared/tokens';
import { Button, TextField } from '@/shared/ui';

// ❌ Incorrect - avoid deep imports
import { apiClient } from '@/shared/api/client';
import { Button } from '@/shared/ui/Button/Button';
```

### Design Tokens Usage

Always use tokens instead of hardcoded values:

```typescript
// ✅ Correct
const StyledDiv = styled.div`
  color: ${tokens.colors.primary[500]};
  gap: ${tokens.spacing.medium};
`;

// ❌ Incorrect
const StyledDiv = styled.div`
  color: #3B82F6;
  gap: 16px;
`;
```

## Key Features

### API Error Handling
All API calls through `apiClient` throw `ApiError` with context:
- Endpoint information
- HTTP method
- Status code
- Original error message

### WebSocket Reliability
- Auto-reconnection: Up to 5 attempts with exponential backoff
- Error logging: Failed message parsing logged with message body
- Connection callbacks: onConnect, onDisconnect, onError

### Modal Consistency
All modal components use shared styles from `Modal.styles.ts`:
- `StyledOverlay`: Backdrop
- `StyledModalContainer`: Modal container
- `StyledCloseButton`: Close button
- `StyledDivider`: Divider line

## Important Notes

### API Client Features
1. **Auto Token Refresh**: On 401, automatically refreshes token and retries request
2. **In-Memory Token Sync**: Always uses latest token from tokenStore
3. **Empty Response Handling**: Returns `{ code: 'OK', message: 'success', data: undefined }` for empty bodies

### WebSocket Best Practices
1. Use `useStompWebSocket` hook for React components (handles cleanup)
2. Use `getStompClient()` singleton for imperative usage
3. Always define message types for type safety: `subscribe<MessageType>(...)`
4. Handle connection errors gracefully (network issues, auth failures)

### UI Component Patterns
1. All components use TypeScript for props
2. Use `as` prop for semantic HTML (`as="h1"`, `as="button"`)
3. Emotion styled-components for styling
4. Follow accessibility best practices (ARIA labels, roles, etc.)

### Performance Optimizations
1. WebSocket polling reduced from 500ms to 2000ms
2. React Query caching for API requests
3. Lazy loading for routes (Next.js automatic code splitting)

## Dependencies

### External Libraries
- **@emotion/react & @emotion/styled**: CSS-in-JS
- **@tanstack/react-query**: Server state management
- **@stomp/stompjs**: STOMP WebSocket protocol
- **react-hook-form**: Form state management
- **zod**: Runtime type validation

## Exports

Shared resources are typically imported directly from subdirectories:
- `@/shared/api/client`
- `@/shared/tokens`
- `@/shared/ui`
- `@/shared/hooks`
- `@/shared/layout`

There is no central `index.ts` for shared - use specific imports as needed.

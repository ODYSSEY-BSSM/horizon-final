# Auth Feature

This feature handles all authentication and user management functionality in the Horizon application.

## Overview

The auth feature provides:
- User registration (signup flow with email verification)
- User login and logout
- Token management (access and refresh tokens)
- User profile management
- Protected route authentication

## Architecture

### Key Components

#### Signup Flow Components
- **SignupStepper**: Multi-step registration process
  - EmailStep: Email input and verification code request
  - VerificationStep: Email verification code validation
  - PasswordStep: Password creation
  - UsernameStep: Username selection and account creation

#### Login Components
- **SigninForm**: Email and password login form

#### Token Management
- **TokenInitializer**: Syncs tokens from cookies to in-memory store on app load
- **tokenStore** (Zustand): In-memory token storage for access/refresh tokens

### API Layer (`api/authApi.ts`)

All authentication API calls:
- `requestVerificationCode`: Send verification code to email
- `verifyCode`: Validate email verification code
- `register`: Create new user account
- `login`: Authenticate user
- `logout`: End user session

### Hooks

#### Signup Hooks (`hooks/signup/`)
- `useEmailForm`: Email input and verification request
- `useVerificationForm`: Code verification and resend logic
- `usePasswordForm`: Password creation
- `useUsernameForm`: Username creation and final registration

**Error Handling**: All signup hooks use ApiError for detailed error messages with network detection

#### Other Hooks
- `useLogin`: Handle login mutation and token storage
- `useLogout`: Handle logout and token cleanup
- `useSignUp`: Registration mutation
- `useUserProfile`: Fetch current user profile

### State Management

#### signupFlow Store (`store/signupFlow.ts`)
Manages the multi-step signup process using Zustand:
- Current step tracking (`email` → `verification` → `password` → `username`)
- Form data persistence across steps
- Step navigation (`goToStep`, `goBack`)

#### tokenStore (`store/tokenStore.ts`)
In-memory token storage (not persisted):
- `setTokens(access, refresh)`: Store both tokens
- `getAccessToken()`: Retrieve access token
- `getRefreshToken()`: Retrieve refresh token
- `clearTokens()`: Remove all tokens

**Security Note**: Tokens are also stored in HTTP-only cookies as the source of truth. The in-memory store is for convenience.

### Validation

Zod schemas in `validations/signup.ts`:
- `emailSchema`: Email format validation
- `verificationSchema`: 6-digit code format
- `passwordSchema`: Password strength requirements
- `usernameSchema`: Username rules

## Usage Examples

### Import Pattern

Always import from the feature's public API:

```typescript
// ✅ Correct
import { useLogin, authApi, tokenStore } from '@/feature/auth';

// ❌ Incorrect
import { useLogin } from '@/feature/auth/hooks/useLogin';
```

### Using Authentication

```typescript
'use client';

import { useLogin } from '@/feature/auth';

export const LoginPage = () => {
  const loginMutation = useLogin();

  const handleSubmit = async (data: { email: string; password: string }) => {
    try {
      await loginMutation.mutateAsync(data);
      // User is automatically redirected after successful login
    } catch (error) {
      // Error is handled by the hook
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
};
```

### Accessing Current User

```typescript
import { useUserProfile } from '@/feature/auth';

export const Profile = () => {
  const { data: user, isLoading } = useUserProfile();

  if (isLoading) return <div>Loading...</div>;

  return <div>Welcome, {user?.username}!</div>;
};
```

### Manual Token Management

```typescript
import { tokenStore } from '@/feature/auth';

// Get current token
const accessToken = tokenStore.getAccessToken();

// Clear tokens (logout)
tokenStore.clearTokens();
```

## Key Files

- `api/authApi.ts`: All authentication API endpoints
- `components/TokenInitializer/`: Syncs cookies to in-memory store
- `hooks/useLogin.ts`: Login mutation with token storage
- `hooks/signup/`: Multi-step signup form hooks
- `store/tokenStore.ts`: In-memory token management
- `store/signupFlow.ts`: Signup stepper state
- `validations/signup.ts`: Form validation schemas
- `index.ts`: Public API exports

## Important Notes

### Token Flow
1. Tokens are initially stored in HTTP-only cookies (set by API)
2. `TokenInitializer` reads cookies and stores in memory (tokenStore)
3. API client (`src/shared/api/client.ts`) uses tokenStore for requests
4. On 401 errors, client automatically attempts token refresh

### Error Handling
All signup hooks implement comprehensive error handling:
- Network errors detected and user-friendly messages shown
- Specific HTTP status codes mapped to appropriate messages
- ApiError class provides context (endpoint, method, status)

### Security Best Practices
- Never log tokens in production
- Token refresh is automatic and handled by API client
- Logout clears both cookies and in-memory tokens
- Protected routes enforced by Next.js middleware

## Dependencies on Other Features

- None (auth is a foundational feature)

## Exports

See `index.ts` for the complete public API. Key exports:
- API: `authApi`
- Hooks: `useLogin`, `useLogout`, `useUserProfile`, signup hooks
- Components: `TokenInitializer`
- Store: `tokenStore`
- Types: `LoginRequest`, `RegisterRequest`, `User`

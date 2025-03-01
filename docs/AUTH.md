# Authentication Setup

This document outlines the authentication setup for the Inherance application.

## Overview

The application uses Supabase for authentication and user management. This is implemented across both the client-side application and Netlify Functions.

## Architecture

### 1. Client-Side Auth (`src/lib/auth/AuthContext.tsx`)
- Uses Supabase Auth client
- Manages user session state
- Handles login/logout operations
- Provides auth context to the application

### 2. Server-Side Auth (Netlify Functions)
- Each function uses Supabase Admin client
- Validates requests using authorization headers
- Manages secure database operations

## Environment Variables

The following environment variables are required:

```env
# Client-side variables (public)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Server-side variables (private)
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_service_role_key
```

## Implementation Details

### 1. Auth Context (`src/lib/auth/AuthContext.tsx`)
- Manages user authentication state
- Handles OAuth login flow
- Provides user information to components
- Manages session persistence

### 2. Auth Callback (`src/app/auth/callback/route.ts`)
- Handles OAuth callback
- Exchanges code for session
- Manages redirect after authentication

### 3. Protected API Routes (Netlify Functions)
- All functions in `netlify/functions/`
- Verify authentication using Supabase
- Use service role key for admin operations

## User Model

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
  points: number;
  pointsSpent: number;
  isAdmin: boolean;
}
```

## Authentication Flow

1. User initiates login
2. Redirected to Supabase OAuth
3. After successful auth, redirected to callback
4. Session established
5. User data loaded from Supabase

## Security Considerations

- Client only uses anon key
- Service role key only used in Netlify Functions
- All sensitive operations performed server-side
- Session validation on all protected routes

## Related Files

1. Authentication:
   - `src/lib/auth/AuthContext.tsx`
   - `src/app/auth/callback/route.ts`

2. API Functions:
   - `netlify/functions/item-management.ts`
   - `netlify/functions/admin-users.ts`
   - `netlify/functions/get-user-data.ts`
   - Other function files

## Dependencies

```json
{
  "@supabase/supabase-js": "^2.39.0"
}
```

## Important Notes

- Do NOT use any other authentication providers
- Always use the existing Supabase setup
- Keep service role key secure in Netlify environment
- Use AuthContext for client-side auth operations

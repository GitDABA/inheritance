# Sibling Item Distribution App

A Next.js application for fairly distributing items among siblings using a weighted priority system.

## Project Structure

```
├── src/
│   ├── app/              # Next.js 13+ app directory
│   ├── components/       # Reusable UI components
│   ├── styles/          # Global styles and design system
│   ├── lib/             # Utility functions and helpers
│   ├── constants/       # Application constants
│   └── types/           # TypeScript type definitions
├── public/              # Static assets
└── netlify/
    └── functions/       # Netlify serverless functions
```

## Tech Stack

- **Frontend**: Next.js 14
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Backend**: Netlify Functions
- **Database**: Supabase
- **Deployment**: Netlify

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development servers:
   - Frontend: `npm run dev` (http://localhost:5279)
   - Backend: `npm run backend` (http://localhost:3334)

3. Run both servers simultaneously:
   ```bash
   npm run dev:all
   ```

## Design System Guidelines

### Colors
- Primary: #2563eb (Blue)
- Secondary: #4f46e5 (Indigo)
- Accent: #ec4899 (Pink)
- Background: #ffffff (White)
- Text: #1f2937 (Gray-800)

### Typography
- Headings: Inter
- Body: Inter
- Base size: 16px
- Scale: 1.25 (Major Third)

### Spacing
- Base unit: 4px
- Scale: 4, 8, 12, 16, 24, 32, 48, 64, 96

### Components
- Follow atomic design principles
- Maintain consistent props interface
- Document component usage with JSDoc
- Include Storybook stories

### Code Style
- Use TypeScript for type safety
- Follow ESLint and Prettier configurations
- Use named exports over default exports
- Implement proper error handling
- Write unit tests for critical functionality

## Git Workflow

1. Create feature branches from `main`
2. Use conventional commits
3. Submit PRs with clear descriptions
4. Require code review before merging

## Performance Guidelines

- Implement proper code splitting
- Optimize images using Next.js Image
- Use React Suspense for loading states
- Cache API responses appropriately
- Monitor Core Web Vitals

## Security Guidelines

- Validate all user inputs
- Implement proper authentication
- Use environment variables for secrets
- Regular dependency updates
- Follow OWASP security practices

## Test Accounts

The application comes with pre-configured test accounts for both admin and regular user roles:

### Admin Account
- Email: admin@example.com
- Password: Admin123!
- Role: Admin
- Initial Points: 1000

### Regular User Account
- Email: user@example.com
- Password: User123!
- Role: User
- Initial Points: 1000

To create these test accounts, run:

```bash
# First set required environment variables
export NETLIFY_SITE_ID=your_site_id
export NETLIFY_AUTH_TOKEN=your_auth_token
export SUPABASE_ANON_KEY=your_supabase_anon_key

# Then run the script
node scripts/create-test-accounts.js
```

Note: These accounts are for testing purposes only. In a production environment, you should use secure passwords and remove test accounts.

## Documentation

- Keep README up to date
- Document API endpoints
- Include component documentation
- Maintain changelog

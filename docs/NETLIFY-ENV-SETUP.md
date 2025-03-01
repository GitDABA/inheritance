# Netlify Environment Variables Setup

To fix the build failure related to missing Supabase environment variables, you need to add the following environment variables in your Netlify project settings:

## Required Environment Variables

1. **NEXT_PUBLIC_SUPABASE_URL**
   - Your Supabase project URL
   - Value: `https://xwnayrioxkcjwbefhkcu.supabase.co`

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Your Supabase project's anonymous API key
   - Value: The anon key provided to you (starts with "eyJhbGciOiJIUzI1NiIsInR5cCI6Ik...")

## How to Add Environment Variables in Netlify

1. Go to your Netlify dashboard
2. Select your site (inheritance-dist)
3. Navigate to **Site settings** > **Environment variables**
4. Click on **Add a variable** and add each of the required variables:
   - Add `NEXT_PUBLIC_SUPABASE_URL` with the value `https://xwnayrioxkcjwbefhkcu.supabase.co`
   - Add `NEXT_PUBLIC_SUPABASE_ANON_KEY` with the value of your anon key
5. Make sure to add them to both **Build variables** and **Runtime variables**

## Local Development Setup

For local development, create a `.env.local` file in your project root with these values:

```
NEXT_PUBLIC_SUPABASE_URL=https://xwnayrioxkcjwbefhkcu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

**IMPORTANT: Never commit the `.env.local` file to your repository as it contains sensitive information.**

## Troubleshooting

If your build fails with the same error after adding these variables:

1. Verify the variables are spelled correctly (case-sensitive)
2. Check that the values are correctly copied without any extra spaces
3. You may need to trigger a new build after adding the variables by deploying again

## Security Considerations

- The variables prefixed with `NEXT_PUBLIC_` will be exposed in the browser
- This is safe for the Supabase anon key as it has limited permissions
- Never add service role keys or other sensitive credentials as public variables

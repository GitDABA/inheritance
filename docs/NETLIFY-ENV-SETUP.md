# Netlify Environment Variables Setup

To fix the build failure related to missing Supabase environment variables, you need to add the following environment variables in your Netlify project settings:

## Required Environment Variables

1. **NEXT_PUBLIC_SUPABASE_URL**
   - Your Supabase project URL
   - Example: `https://xwnayrioxkcjwbefhkcu.supabase.co`

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Your Supabase project's anonymous API key
   - This can be found in your Supabase project dashboard under Settings > API

## How to Add Environment Variables in Netlify

1. Go to your Netlify dashboard
2. Select your site (inheritance-dist)
3. Navigate to **Site settings** > **Environment variables**
4. Click on **Add a variable** and add each of the required variables
5. Make sure to add them to both **Build variables** and **Runtime variables**

## Troubleshooting

If your build fails with the same error after adding these variables:

1. Verify the variables are spelled correctly (case-sensitive)
2. Check that the values are correctly copied from Supabase
3. You may need to trigger a new build after adding the variables by deploying again

## Security Considerations

- The variables prefixed with `NEXT_PUBLIC_` will be exposed in the browser
- This is safe for the Supabase anon key as it has limited permissions
- Never add service role keys or other sensitive credentials as public variables

## Testing Locally

To test that these variables are properly configured, create a `.env.local` file in your project root with these variables and run:

```bash
npm run dev
```

If the application starts without errors, the environment variables are correctly set.

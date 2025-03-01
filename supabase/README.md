# Automated Supabase Setup

This directory contains scripts to automatically set up your Supabase project with all required tables, policies, functions, and storage buckets for the Inheritance Distribution App.

## Prerequisites

1. Create a Supabase project at [app.supabase.com](https://app.supabase.com)
2. Get your project URL and API keys from the project dashboard

## Setup Instructions

### 1. Set Environment Variables

Create a `.env` file in this directory with:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key
```

You can find these values in your Supabase dashboard under Project Settings > API.

### 2. Run SQL Migrations

You have two options to run the migrations:

#### Option A: Using Supabase CLI (Recommended)

1. Install Supabase CLI if you haven't already:
   ```bash
   npm install -g supabase
   ```

2. Link your project:
   ```bash
   supabase link --project-ref your-project-ref
   ```
   (Find your project reference in your Supabase dashboard URL)

3. Push migrations:
   ```bash
   supabase db push
   ```

#### Option B: Manual SQL Execution

1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy the contents of `migrations/20250301_initial_setup.sql`
4. Paste into the SQL Editor and run

### 3. Set Up Storage Bucket

Run the storage setup script:

```bash
node storage.js
```

This will create the required `item-images` bucket and set up appropriate security policies.

### 4. Configure Authentication Redirect URLs

In your Supabase dashboard:

1. Go to Authentication > URL Configuration
2. Add the following URLs:
   ```
   http://localhost:5279/auth/callback
   http://localhost:3334/auth/callback
   https://inheritance-dist.netlify.app/auth/callback
   ```

### 5. Create Admin User

After setting up the database:

1. Sign up through your application
2. Go to Supabase dashboard > Authentication > Users
3. Find your user and click Edit
4. Update the user metadata to add admin privileges:
   ```json
   {
     "is_admin": true,
     "points": 1000,
     "points_spent": 0,
     "role": "admin"
   }
   ```

## Verification

To verify your setup:
1. Check if all tables are created in the Table Editor
2. Confirm storage bucket exists under Storage
3. Test authentication and file uploads through your application

## Troubleshooting

If you encounter any issues:
1. Check the console output for specific error messages
2. Verify your environment variables are set correctly
3. Ensure you have the necessary permissions in your Supabase project

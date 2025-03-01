#!/bin/bash

# Automated Supabase Setup Script for Inheritance Distribution App

# Check if .env file exists
if [ ! -f ".env" ]; then
  echo "Error: .env file not found!"
  echo "Please create a .env file with your Supabase credentials:"
  echo "NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url"
  echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key"
  echo "SUPABASE_SERVICE_KEY=your_supabase_service_key"
  exit 1
fi

# Load environment variables
export $(cat .env | grep -v '^#' | xargs)

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
  echo "Supabase CLI not found. Installing..."
  npm install -g supabase
fi

# Ask for project reference
echo "Enter your Supabase project reference (found in the URL of your project dashboard):"
read PROJECT_REF

# Link project
echo "Linking your Supabase project..."
supabase link --project-ref $PROJECT_REF

# Push migrations
echo "Pushing database migrations..."
supabase db push

# Run storage setup script
echo "Setting up storage bucket..."
node storage.js

echo "✅ Supabase setup complete!"
echo ""
echo "Next steps:"
echo "1. Configure your redirect URLs in the Supabase dashboard"
echo "   - Go to Authentication > URL Configuration"
echo "   - Add: http://localhost:5279/auth/callback"
echo "   - Add: http://localhost:3334/auth/callback"
echo "   - Add: https://inheritance-dist.netlify.app/auth/callback"
echo ""
echo "2. Create an admin user by signing up in your app"
echo "   - Then go to Supabase dashboard > Authentication > Users"
echo "   - Find your user and add admin privileges to metadata"
echo ""
echo "Your Supabase project is now ready to use with the Inheritance Distribution App!"

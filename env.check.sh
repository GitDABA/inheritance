#!/bin/bash

# Required environment variables
required_vars=(
  "SUPABASE_URL"
  "SUPABASE_ANON_KEY"
  "NETLIFY_IDENTITY_URL"
  "NETLIFY_AUTH_TOKEN"
  "NEXT_PUBLIC_SUPABASE_URL"
  "NEXT_PUBLIC_SUPABASE_ANON_KEY"
)

# Check if each required variable is set
missing_vars=()
for var in "${required_vars[@]}"; do
  if [[ -z "${!var}" ]]; then
    missing_vars+=("$var")
  fi
done

# Report results
if [[ ${#missing_vars[@]} -eq 0 ]]; then
  echo "✅ All required environment variables are set"
else
  echo "❌ Missing required environment variables:"
  printf '%s\n' "${missing_vars[@]}"
  exit 1
fi

const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');

const NETLIFY_SITE_ID = process.env.NETLIFY_SITE_ID;
const NETLIFY_AUTH_TOKEN = process.env.NETLIFY_AUTH_TOKEN;

const supabase = createClient(
  'https://xwnayrioxkcjwbefhkcu.supabase.co',
  process.env.SUPABASE_ANON_KEY
);

async function createTestAccounts() {
  try {
    // Create admin account
    const adminResponse = await fetch(
      `https://api.netlify.com/api/v1/sites/${NETLIFY_SITE_ID}/identity/users`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${NETLIFY_AUTH_TOKEN}`,
        },
        body: JSON.stringify({
          email: 'admin@example.com',
          password: 'Admin123!',
          app_metadata: {
            roles: ['admin']
          },
          user_metadata: {
            full_name: 'Admin User'
          }
        })
      }
    );

    const adminUser = await adminResponse.json();
    
    // Create regular user account
    const userResponse = await fetch(
      `https://api.netlify.com/api/v1/sites/${NETLIFY_SITE_ID}/identity/users`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${NETLIFY_AUTH_TOKEN}`,
        },
        body: JSON.stringify({
          email: 'user@example.com',
          password: 'User123!',
          app_metadata: {
            roles: ['user']
          },
          user_metadata: {
            full_name: 'Regular User'
          }
        })
      }
    );

    const regularUser = await userResponse.json();

    // Create Supabase user records
    await supabase.from('users').insert([
      {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.user_metadata.full_name,
        isAdmin: true,
        points: 1000,
        pointsSpent: 0
      },
      {
        id: regularUser.id,
        email: regularUser.email,
        name: regularUser.user_metadata.full_name,
        isAdmin: false,
        points: 1000,
        pointsSpent: 0
      }
    ]);

    console.log('Test accounts created successfully!');
    console.log('Admin account:', {
      email: 'admin@example.com',
      password: 'Admin123!'
    });
    console.log('Regular user account:', {
      email: 'user@example.com',
      password: 'User123!'
    });
  } catch (error) {
    console.error('Error creating test accounts:', error);
  }
}

createTestAccounts();

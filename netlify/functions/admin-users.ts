import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://xwnayrioxkcjwbefhkcu.supabase.co',
  process.env.SUPABASE_ANON_KEY!
);

export const handler: Handler = async (event, context) => {
  // Verify admin authorization
  if (!event.headers.authorization) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Unauthorized' })
    };
  }

  const token = event.headers.authorization.split(' ')[1];

  try {
    // Verify token with Netlify Identity
    const response = await fetch(`${process.env.NETLIFY_IDENTITY_URL}/.netlify/identity/user`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!response.ok) throw new Error('Invalid token');
    const userData = await response.json();

    // Verify admin role
    if (!userData.app_metadata?.roles?.includes('admin')) {
      return {
        statusCode: 403,
        body: JSON.stringify({ error: 'Forbidden' })
      };
    }

    switch (event.httpMethod) {
      case 'GET': {
        const { data: users, error } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) throw error;

        return {
          statusCode: 200,
          body: JSON.stringify(users)
        };
      }

      default:
        return {
          statusCode: 405,
          body: JSON.stringify({ error: 'Method not allowed' })
        };
    }
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};

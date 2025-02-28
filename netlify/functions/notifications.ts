import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://xwnayrioxkcjwbefhkcu.supabase.co',
  process.env.SUPABASE_ANON_KEY!
);

export const handler: Handler = async (event, context) => {
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

    switch (event.httpMethod) {
      case 'GET': {
        // Get user's notifications
        const { data, error } = await supabase
          .from('notifications')
          .select(`
            *,
            distribution:distributions(name),
            item:items(title)
          `)
          .eq('user_id', userData.id)
          .order('created_at', { ascending: false })
          .limit(50);

        if (error) throw error;

        return {
          statusCode: 200,
          body: JSON.stringify(data)
        };
      }

      case 'POST': {
        // Mark notifications as read
        const { notificationIds } = JSON.parse(event.body || '{}');

        if (!notificationIds || !Array.isArray(notificationIds)) {
          return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Invalid notification IDs' })
          };
        }

        const { error } = await supabase
          .from('notifications')
          .update({ read: true })
          .in('id', notificationIds)
          .eq('user_id', userData.id);

        if (error) throw error;

        return {
          statusCode: 200,
          body: JSON.stringify({ success: true })
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

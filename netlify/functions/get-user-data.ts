import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export const handler: Handler = async (event) => {
  // Verify authentication
  if (!event.headers.authorization) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Unauthorized' })
    };
  }

  try {
    const token = event.headers.authorization.split(' ')[1];
    
    // Verify the token with Netlify Identity
    const response = await fetch(`${process.env.NETLIFY_IDENTITY_URL}/.netlify/identity/user`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Invalid token');
    }

    const userData = await response.json();

    // Get additional user data from Supabase
    const { data: userProfile, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userData.id)
      .single();

    if (error) {
      // If user doesn't exist in Supabase, create them
      if (error.code === 'PGRST116') {
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert({
            id: userData.id,
            email: userData.email,
            name: userData.user_metadata?.name || userData.email.split('@')[0],
            role: 'user',
            points: 1000, // Initial points allocation
            pointsSpent: 0
          })
          .select()
          .single();

        if (createError) throw createError;
        return {
          statusCode: 200,
          body: JSON.stringify(newUser)
        };
      }
      throw error;
    }

    return {
      statusCode: 200,
      body: JSON.stringify(userProfile)
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};

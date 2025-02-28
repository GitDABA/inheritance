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
      case 'POST': {
        const { itemId, points, distributionId } = JSON.parse(event.body || '{}');

        // Validate input
        if (!itemId || !points || !distributionId) {
          return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Missing required fields' })
          };
        }

        // Check if distribution is active
        const { data: distribution } = await supabase
          .from('distributions')
          .select('status')
          .eq('id', distributionId)
          .single();

        if (!distribution || distribution.status !== 'active') {
          return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Distribution is not active' })
          };
        }

        // Check user's available points
        const { data: user } = await supabase
          .from('users')
          .select('points, points_spent')
          .eq('id', userData.id)
          .single();

        if (!user || user.points - user.points_spent < points) {
          return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Insufficient points' })
          };
        }

        // Begin transaction
        const { data: allocation, error: allocationError } = await supabase
          .from('item_allocations')
          .upsert({
            item_id: itemId,
            user_id: userData.id,
            distribution_id: distributionId,
            points_allocated: points,
            status: 'pending'
          })
          .select()
          .single();

        if (allocationError) throw allocationError;

        // Update user's points_spent
        const { error: updateError } = await supabase
          .from('users')
          .update({ points_spent: user.points_spent + points })
          .eq('id', userData.id);

        if (updateError) throw updateError;

        // Create notification
        await supabase.from('notifications').insert({
          user_id: userData.id,
          type: 'point_allocation',
          content: `You have allocated ${points} points to an item`,
          distribution_id: distributionId,
          item_id: itemId
        });

        return {
          statusCode: 200,
          body: JSON.stringify(allocation)
        };
      }

      case 'GET': {
        const { data, error } = await supabase
          .from('item_allocations')
          .select(`
            *,
            item:items(title),
            distribution:distributions(name, status)
          `)
          .eq('user_id', userData.id);

        if (error) throw error;

        return {
          statusCode: 200,
          body: JSON.stringify(data)
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

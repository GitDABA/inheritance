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

    // Verify admin role
    if (!userData.app_metadata?.roles?.includes('admin')) {
      return {
        statusCode: 403,
        body: JSON.stringify({ error: 'Forbidden' })
      };
    }

    // Get all distributions
    const { data: distributions, error: distributionsError } = await supabase
      .from('distributions')
      .select('id, status');

    if (distributionsError) throw distributionsError;

    // Get total items
    const { count: totalItems, error: itemsError } = await supabase
      .from('items')
      .select('id', { count: 'exact' });

    if (itemsError) throw itemsError;

    // Calculate participation rates and points used for each distribution
    const analytics = {
      totalItems,
      participationRates: {},
      pointsUsed: {}
    };

    for (const distribution of distributions) {
      // Get total users
      const { count: totalUsers } = await supabase
        .from('users')
        .select('id', { count: 'exact' });

      // Get participating users
      const { data: participatingUsersData } = await supabase
        .from('item_allocations')
        .select('user_id')
        .eq('distribution_id', distribution.id);

      // Count unique users
      const uniqueUsers = new Set(participatingUsersData?.map(item => item.user_id));
      const participatingUsers = uniqueUsers.size;

      // Calculate participation rate
      analytics.participationRates[distribution.id] = 
        Math.round((participatingUsers / totalUsers) * 100);

      // Get total points used
      const { data: pointsData } = await supabase
        .from('item_allocations')
        .select('points_allocated')
        .eq('distribution_id', distribution.id);

      analytics.pointsUsed[distribution.id] = 
        pointsData?.reduce((sum, item) => sum + item.points_allocated, 0) || 0;
    }

    return {
      statusCode: 200,
      body: JSON.stringify(analytics)
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};

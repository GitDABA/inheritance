import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://xwnayrioxkcjwbefhkcu.supabase.co',
  process.env.SUPABASE_ANON_KEY!,
  {
    db: {
      schema: 'public'
    },
    auth: {
      persistSession: false
    }
  }
);

export const handler: Handler = async (event, context) => {
  // Verify authentication
  if (!event.headers.authorization) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Unauthorized' })
    };
  }

  const token = event.headers.authorization.split(' ')[1];
  
  try {
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

    // Check if user is admin for certain operations
    const { data: userRole } = await supabase
      .from('users')
      .select('role')
      .eq('id', userData.id)
      .single();

    const isAdmin = userRole?.role === 'admin';

    switch (event.httpMethod) {
      case 'POST': {
        // Only admins can create distributions
        if (!isAdmin) {
          return {
            statusCode: 403,
            body: JSON.stringify({ error: 'Only admins can create distributions' })
          };
        }

        const distributionData = JSON.parse(event.body || '{}');
        
        // Validate required fields
        if (!distributionData.name || !distributionData.startDate || !distributionData.endDate) {
          return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Name, start date, and end date are required' })
          };
        }

        // Add distribution to database
        const { data, error } = await supabase
          .from('distributions')
          .insert({
            name: distributionData.name,
            status: distributionData.status || 'pending',
            start_date: distributionData.startDate,
            end_date: distributionData.endDate,
            created_by: userData.id
          })
          .select()
          .single();

        if (error) throw error;

        return {
          statusCode: 201,
          body: JSON.stringify(data)
        };
      }

      case 'GET': {
        const distributionId = event.queryStringParameters?.id;

        if (distributionId) {
          // Get specific distribution with its items and allocations
          const { data, error } = await supabase
            .from('distributions')
            .select(`
              *,
              items (
                *,
                allocations:item_allocations (
                  user_id,
                  points_allocated,
                  status
                )
              )
            `)
            .eq('id', distributionId)
            .single();

          if (error) throw error;

          return {
            statusCode: 200,
            body: JSON.stringify(data)
          };
        } else {
          // List all distributions
          const query = supabase
            .from('distributions')
            .select('*')
            .order('created_at', { ascending: false });

          // Non-admins only see active or completed distributions
          if (!isAdmin) {
            query.in('status', ['active', 'completed']);
          }

          const { data, error } = await query;

          if (error) throw error;

          return {
            statusCode: 200,
            body: JSON.stringify(data)
          };
        }
      }

      case 'PUT': {
        // Only admins can update distributions
        if (!isAdmin) {
          return {
            statusCode: 403,
            body: JSON.stringify({ error: 'Only admins can update distributions' })
          };
        }

        const distributionId = event.path.split('/').pop();
        const updates = JSON.parse(event.body || '{}');

        const { data, error } = await supabase
          .from('distributions')
          .update({
            name: updates.name,
            status: updates.status,
            start_date: updates.startDate,
            end_date: updates.endDate,
            updated_at: new Date().toISOString()
          })
          .eq('id', distributionId)
          .select()
          .single();

        if (error) throw error;

        return {
          statusCode: 200,
          body: JSON.stringify(data)
        };
      }

      case 'DELETE': {
        // Only admins can delete distributions
        if (!isAdmin) {
          return {
            statusCode: 403,
            body: JSON.stringify({ error: 'Only admins can delete distributions' })
          };
        }

        const distributionId = event.path.split('/').pop();

        const { error } = await supabase
          .from('distributions')
          .delete()
          .eq('id', distributionId);

        if (error) throw error;

        return {
          statusCode: 204,
          body: ''
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

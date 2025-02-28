import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
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

    switch (event.httpMethod) {
      case 'POST': {
        const itemData = JSON.parse(event.body || '{}');
        
        // Validate required fields
        if (!itemData.title) {
          return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Title is required' })
          };
        }

        // Add item to database
        const { data, error } = await supabase
          .from('items')
          .insert({
            title: itemData.title,
            description: itemData.description,
            price: itemData.price,
            imageUrl: itemData.imageUrl,
            createdBy: userData.id,
            distributionId: itemData.distributionId
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
        const { data, error } = await supabase
          .from('items')
          .select(`
            *,
            allocations:item_allocations(
              userId,
              pointsAllocated,
              status
            )
          `)
          .eq('distributionId', event.queryStringParameters?.distributionId || '');

        if (error) throw error;

        return {
          statusCode: 200,
          body: JSON.stringify(data)
        };
      }

      case 'PUT': {
        const itemId = event.path.split('/').pop();
        const updates = JSON.parse(event.body || '{}');

        // Verify ownership or admin status
        const { data: item } = await supabase
          .from('items')
          .select('createdBy')
          .eq('id', itemId)
          .single();

        if (item?.createdBy !== userData.id) {
          const { data: userRole } = await supabase
            .from('users')
            .select('role')
            .eq('id', userData.id)
            .single();

          if (userRole?.role !== 'admin') {
            return {
              statusCode: 403,
              body: JSON.stringify({ error: 'Unauthorized to modify this item' })
            };
          }
        }

        const { data, error } = await supabase
          .from('items')
          .update(updates)
          .eq('id', itemId)
          .select()
          .single();

        if (error) throw error;

        return {
          statusCode: 200,
          body: JSON.stringify(data)
        };
      }

      case 'DELETE': {
        const itemId = event.path.split('/').pop();

        // Verify ownership or admin status
        const { data: item } = await supabase
          .from('items')
          .select('createdBy')
          .eq('id', itemId)
          .single();

        if (item?.createdBy !== userData.id) {
          const { data: userRole } = await supabase
            .from('users')
            .select('role')
            .eq('id', userData.id)
            .single();

          if (userRole?.role !== 'admin') {
            return {
              statusCode: 403,
              body: JSON.stringify({ error: 'Unauthorized to delete this item' })
            };
          }
        }

        const { error } = await supabase
          .from('items')
          .delete()
          .eq('id', itemId);

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

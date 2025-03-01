import { Item } from '@/types';
import { supabase } from '@/lib/supabase/client';

async function getAuthHeader() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token ? `Bearer ${session.access_token}` : '';
}

export async function getItems(distributionId: string): Promise<Item[]> {
  const response = await fetch(`/.netlify/functions/item-management?distributionId=${distributionId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': await getAuthHeader(),
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch items');
  }

  return response.json();
}

export async function createItem(itemData: Partial<Item>): Promise<Item> {
  const response = await fetch('/.netlify/functions/item-management', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': await getAuthHeader(),
    },
    body: JSON.stringify(itemData),
  });

  if (!response.ok) {
    throw new Error('Failed to create item');
  }

  return response.json();
}

export async function updateItem(id: string, itemData: Partial<Item>): Promise<Item> {
  const response = await fetch(`/.netlify/functions/item-management?id=${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': await getAuthHeader(),
    },
    body: JSON.stringify(itemData),
  });

  if (!response.ok) {
    throw new Error('Failed to update item');
  }

  return response.json();
}

export async function deleteItem(id: string): Promise<void> {
  const response = await fetch(`/.netlify/functions/item-management?id=${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': await getAuthHeader(),
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete item');
  }
}

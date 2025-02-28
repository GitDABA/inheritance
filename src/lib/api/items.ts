'use client';

import netlifyIdentity from 'netlify-identity-widget';

async function getAuthHeader() {
  // Get the current user's token from Netlify Identity
  const user = netlifyIdentity.currentUser();
  return user ? `Bearer ${user.token.access_token}` : '';
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
    const error = await response.json();
    throw new Error(error.message || 'Failed to create item');
  }

  return response.json();
}

export async function getItems(distributionId?: string): Promise<Item[]> {
  const url = new URL('/.netlify/functions/item-management', window.location.origin);
  if (distributionId) {
    url.searchParams.append('distributionId', distributionId);
  }

  const response = await fetch(url.toString(), {
    headers: {
      'Authorization': await getAuthHeader(),
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch items');
  }

  return response.json();
}

export async function updateItem(itemId: string, updates: Partial<Item>): Promise<Item> {
  const response = await fetch(`/.netlify/functions/item-management/${itemId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': await getAuthHeader(),
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update item');
  }

  return response.json();
}

export async function deleteItem(itemId: string): Promise<void> {
  const response = await fetch(`/.netlify/functions/item-management/${itemId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': await getAuthHeader(),
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete item');
  }
}

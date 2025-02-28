import { Distribution } from '@/types';

async function getAuthHeader() {
  const netlifyIdentity = require('netlify-identity-widget');
  const user = netlifyIdentity.currentUser();
  return user ? `Bearer ${user.token.access_token}` : '';
}

export async function createDistribution(data: Partial<Distribution>): Promise<Distribution> {
  const response = await fetch('/.netlify/functions/distribution-management', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': await getAuthHeader(),
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create distribution');
  }

  return response.json();
}

export async function getDistributions(): Promise<Distribution[]> {
  const response = await fetch('/.netlify/functions/distribution-management', {
    headers: {
      'Authorization': await getAuthHeader(),
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch distributions');
  }

  return response.json();
}

export async function getDistribution(id: string): Promise<Distribution> {
  const response = await fetch(`/.netlify/functions/distribution-management?id=${id}`, {
    headers: {
      'Authorization': await getAuthHeader(),
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch distribution');
  }

  return response.json();
}

export async function updateDistribution(id: string, updates: Partial<Distribution>): Promise<Distribution> {
  const response = await fetch(`/.netlify/functions/distribution-management/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': await getAuthHeader(),
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update distribution');
  }

  return response.json();
}

export async function deleteDistribution(id: string): Promise<void> {
  const response = await fetch(`/.netlify/functions/distribution-management/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': await getAuthHeader(),
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete distribution');
  }
}

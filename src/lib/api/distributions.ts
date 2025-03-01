import { Distribution } from '@/types';
import { supabase } from '@/lib/supabase/client';

async function getAuthHeader() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token ? `Bearer ${session.access_token}` : '';
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
  const response = await fetch(`/.netlify/functions/distribution-management/${id}`, {
    headers: {
      'Authorization': await getAuthHeader(),
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch distribution');
  }

  const data = await response.json();
  return {
    ...data,
    items: data.items || [], // Ensure items is always an array
  };
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

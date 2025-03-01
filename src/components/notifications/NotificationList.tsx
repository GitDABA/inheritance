'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { supabase } from '@/lib/supabase/client';

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  createdAt: string;
  read: boolean;
}

export default function NotificationList() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch('/.netlify/functions/notifications', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    if (!user) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(`/.netlify/functions/notifications/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ read: true }),
      });

      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }

      setNotifications(prev =>
        prev.map(notif =>
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  if (loading) {
    return <div>Loading notifications...</div>;
  }

  return (
    <div className="space-y-4">
      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications</p>
      ) : (
        notifications.map(notification => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg shadow ${
              notification.read ? 'bg-gray-50' : 'bg-white'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className={`text-sm ${notification.read ? 'text-gray-500' : 'text-gray-900'}`}>
                  {notification.message}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(notification.createdAt).toLocaleDateString()}
                </p>
              </div>
              {!notification.read && (
                <button
                  onClick={() => markAsRead(notification.id)}
                  className="text-xs text-primary-600 hover:text-primary-700"
                >
                  Mark as read
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

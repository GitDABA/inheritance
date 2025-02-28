'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';

interface Notification {
  id: string;
  type: string;
  content: string;
  read: boolean;
  created_at: string;
  distribution?: { name: string };
  item?: { title: string };
}

export default function NotificationList() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const response = await fetch('/.netlify/functions/notifications', {
        headers: {
          'Authorization': `Bearer ${user?.token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to load notifications');
      }

      const data = await response.json();
      setNotifications(data);
      setError(null);
    } catch (error) {
      console.error('Error loading notifications:', error);
      setError(error instanceof Error ? error : new Error('Failed to load notifications'));
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationIds: string[]) => {
    try {
      const response = await fetch('/.netlify/functions/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ notificationIds }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to mark notifications as read');
      }

      setNotifications(prev =>
        prev.map(notification =>
          notificationIds.includes(notification.id)
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        Error: {error.message}
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center text-gray-500 p-4">
        No notifications
      </div>
    );
  }

  const unreadNotifications = notifications.filter(n => !n.read);

  return (
    <div className="space-y-4">
      {unreadNotifications.length > 0 && (
        <div className="flex justify-between items-center px-4">
          <span className="text-sm font-medium text-gray-700">
            {unreadNotifications.length} unread notifications
          </span>
          <button
            onClick={() => markAsRead(unreadNotifications.map(n => n.id))}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            Mark all as read
          </button>
        </div>
      )}

      <div className="divide-y divide-gray-200">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 ${notification.read ? 'bg-white' : 'bg-blue-50'}`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="text-sm text-gray-900">{notification.content}</p>
                {(notification.distribution || notification.item) && (
                  <p className="mt-1 text-sm text-gray-500">
                    {notification.distribution?.name} - {notification.item?.title}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  {new Date(notification.created_at).toLocaleDateString()}
                </p>
              </div>
              {!notification.read && (
                <button
                  onClick={() => markAsRead([notification.id])}
                  className="ml-4 text-sm text-primary-600 hover:text-primary-700"
                >
                  Mark as read
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

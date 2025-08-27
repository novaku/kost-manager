import React from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import Toast from './Toast';

const ToastContainer: React.FC = () => {
  const { notifications } = useNotification();

  // Only show notifications with duration (toasts), not persistent notifications
  const toasts = notifications.filter(notification => notification.duration !== 0);

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-4 max-w-sm w-full">
      {toasts.slice(0, 5).map((notification) => (
        <Toast key={notification.id} notification={notification} />
      ))}
    </div>
  );
};

export default ToastContainer;

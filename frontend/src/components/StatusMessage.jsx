import React, { useEffect } from 'react';

/**
 * StatusMessage Component
 * Displays banner/toast alerts for success, error, or info notifications.
 * Automatically clears after 5 seconds or when the user clicks close.
 */
function StatusMessage({ notification, onClose }) {
  useEffect(() => {
    if (!notification) return;

    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [notification, onClose]);

  if (!notification || !notification.message) return null;

  const { type = 'info', message } = notification;

  let bannerClass = 'alert-info';
  let icon = 'ℹ️';

  if (type === 'success') {
    bannerClass = 'alert-success';
    icon = '✅';
  } else if (type === 'error') {
    bannerClass = 'alert-error';
    icon = '⚠️';
  }

  return (
    <div className={`alert-banner ${bannerClass}`} role="alert">
      <div className="alert-content">
        <span className="alert-icon">{icon}</span>
        <span className="alert-text">{message}</span>
      </div>
      <button
        type="button"
        className="alert-close-btn"
        onClick={onClose}
        aria-label="Close notification"
        title="Dismiss"
      >
        &times;
      </button>
    </div>
  );
}

export default StatusMessage;

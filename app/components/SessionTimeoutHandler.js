'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { toast } from 'react-toastify';

const SessionTimeoutHandler = ({ children }) => {
  const { data: session } = useSession();
  const [lastActivity, setLastActivity] = useState(new Date());
  const [timeoutId, setTimeoutId] = useState(null);

  const getSessionTimeout = () => {
    if (typeof window !== 'undefined') {
      const savedSettings = localStorage.getItem('admin_settings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        return (settings.sessionTimeout || 30) * 60 * 1000; // minutes to ms
      }
    }
    return 30 * 60 * 1000; // Default 30 minutes
  };

  const handleSignOut = useCallback(() => {
    toast.warn('Sesi Anda telah berakhir karena tidak ada aktivitas. Anda akan diarahkan ke halaman login.');
    setTimeout(() => {
      signOut({ callbackUrl: '/auth/login' });
    }, 3000);
  }, []);

  const resetTimer = useCallback(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    const newTimeoutId = setTimeout(handleSignOut, getSessionTimeout());
    setTimeoutId(newTimeoutId);
    setLastActivity(new Date());
  }, [handleSignOut, timeoutId]);

  const handleActivity = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  useEffect(() => {
    if (session) {
      const events = ['mousemove', 'keydown', 'mousedown', 'touchstart'];

      events.forEach(event => {
        window.addEventListener(event, handleActivity);
      });

      resetTimer();

      return () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        events.forEach(event => {
          window.removeEventListener(event, handleActivity);
        });
      };
    }
  }, [session, handleActivity, resetTimer]);

  return <>{children}</>;
};

export default SessionTimeoutHandler;
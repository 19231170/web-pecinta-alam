'use client';

import { SessionProvider, useSession, signOut } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'react-hot-toast';

// Auto-logout component
function AutoLogoutHandler({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const timeoutRef = useRef(null);
  const warningTimeoutRef = useRef(null);
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const lastActivityRef = useRef(Date.now());

  // Auto-logout timeout: 10 minutes (600000ms)
  const TIMEOUT_DURATION = 10 * 60 * 1000; // 10 minutes
  // Warning shown 1 minute before auto-logout
  const WARNING_DURATION = 60 * 1000; // 1 minute

  const resetTimeout = () => {
    lastActivityRef.current = Date.now();
    setShowWarning(false);
    
    // Clear existing timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }

    // Only set timeout if user is authenticated
    if (session && status === 'authenticated') {
      // Set warning timeout (9 minutes)
      warningTimeoutRef.current = setTimeout(() => {
        setShowWarning(true);
        setCountdown(60);
        
        // Start countdown
        const countdownInterval = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(countdownInterval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        // Auto-logout after warning period
        timeoutRef.current = setTimeout(() => {
          clearInterval(countdownInterval);
          handleAutoLogout();
        }, WARNING_DURATION);
      }, TIMEOUT_DURATION - WARNING_DURATION);
    }
  };

  const handleAutoLogout = async () => {
    setShowWarning(false);
    toast.error('Sesi Anda telah berakhir karena tidak ada aktivitas selama 10 menit');
    
    try {
      await signOut({ 
        redirect: false,
        callbackUrl: '/auth/login' 
      });
      router.push('/auth/login');
    } catch (error) {
      console.error('Error during auto-logout:', error);
      router.push('/auth/login');
    }
  };

  const extendSession = () => {
    resetTimeout();
    toast.success('Sesi diperpanjang');
  };

  // Track user activity
  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const resetTimeoutOnActivity = () => {
      if (session && status === 'authenticated') {
        resetTimeout();
      }
    };

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, resetTimeoutOnActivity, true);
    });

    // Initialize timeout when component mounts and user is authenticated
    if (session && status === 'authenticated') {
      resetTimeout();
    }

    return () => {
      // Cleanup
      events.forEach(event => {
        document.removeEventListener(event, resetTimeoutOnActivity, true);
      });
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
    };
  }, [session, status]);

  // Handle session changes
  useEffect(() => {
    if (status === 'unauthenticated') {
      // Clear timeouts when user is not authenticated
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
      setShowWarning(false);
    } else if (session && status === 'authenticated') {
      // Reset timeout when user logs in
      resetTimeout();
    }
  }, [session, status]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      {children}
      
      {/* Auto-logout warning modal */}
      {showWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-center mb-4">
              <div className="bg-yellow-100 p-2 rounded-full mr-3">
                <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Peringatan Sesi</h3>
            </div>
            
            <p className="text-gray-600 mb-4">
              Sesi Anda akan berakhir dalam <span className="font-bold text-red-600">{countdown} detik</span> karena tidak ada aktivitas.
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={extendSession}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Perpanjang Sesi
              </button>
              <button
                onClick={handleAutoLogout}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors font-medium"
              >
                Logout Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function AuthProvider({ children, session }) {
  return (
    <SessionProvider 
      session={session}
      // Refetch session every 5 minutes to keep it fresh
      refetchInterval={5 * 60}
      // Refetch session when window gets focus
      refetchOnWindowFocus={true}
      // Refetch when coming back online
      refetchWhenOffline={false}
    >
      <AutoLogoutHandler>
        {children}
      </AutoLogoutHandler>
    </SessionProvider>
  );
}

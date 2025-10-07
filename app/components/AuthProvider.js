'use client';

import { SessionProvider } from 'next-auth/react';
import SessionTimeoutHandler from './SessionTimeoutHandler';

export default function AuthProvider({ children, session }) {
  return (
    <SessionProvider session={session}>
      <SessionTimeoutHandler>
        {children}
      </SessionTimeoutHandler>
    </SessionProvider>
  );
}

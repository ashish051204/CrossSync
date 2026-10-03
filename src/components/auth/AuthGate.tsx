import React from 'react';
import { Show, SignIn } from '@clerk/react';

interface AuthGateProps {
  children: React.ReactNode;
}

const AuthGate: React.FC<AuthGateProps> = ({ children }) => {
  return (
    <Show
      when="signed-in"
      fallback={
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
          <SignIn
            appearance={{
              elements: {
                rootBox: 'mx-auto',
                card: 'shadow-xl',
              },
            }}
          />
        </div>
      }
    >
      {children}
    </Show>
  );
};

export default AuthGate;
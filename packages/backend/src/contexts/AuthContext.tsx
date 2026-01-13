import React, { createContext, useState, useContext, ReactNode } from 'react';

export const AuthContext = createContext<any>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<any>(null);

  async function signIn(credentials: any): Promise<void> {
    try {
      const response = await fetch('http://10.0.2.2:3333/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.error('Erro no login:', error);
    }
  }

  return React.createElement(
    AuthContext.Provider,
    {
      value: {
        signed: !!user,
        user,
        signIn,
      },
    },
    children
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

import React, { createContext, useEffect, useState } from 'react';
import api from '../services/api';

type User = {
  id: string;
  name: string;
  email: string;
};

type AuthContextData = {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
};

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userStorage = globalThis?.localStorage?.getItem('user');
    if (userStorage) {
      setUser(JSON.parse(userStorage));
    }
  }, []);

  async function signIn(email: string, password: string) {
    const response = await api.post('/login', { email, password });

    const { token, user } = response.data;

    globalThis?.localStorage?.setItem('token', token);
    globalThis?.localStorage?.setItem('user', JSON.stringify(user));

    setUser(user);
  }

  function signOut() {
    globalThis?.localStorage?.removeItem('token');
    globalThis?.localStorage?.removeItem('user');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

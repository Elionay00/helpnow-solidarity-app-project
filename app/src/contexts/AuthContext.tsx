import React, { createContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';

interface AuthContextData {
  signed: boolean;
  user: any | null;
  signIn(credentials: any): Promise<void>;
  signOut(): void;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const storagedUser = localStorage.getItem('@HelpNow:user');
    const storagedToken = localStorage.getItem('@HelpNow:token');
    if (storagedUser && storagedToken) {
      setUser(JSON.parse(storagedUser));
    }
  }, []);

  async function signIn(credentials: any) {
    const response = await api.post('/login', credentials);
    const { token, user: userData } = response.data;
    setUser(userData);
    localStorage.setItem('@HelpNow:user', JSON.stringify(userData));
    localStorage.setItem('@HelpNow:token', token);
  }

  function signOut() {
    localStorage.clear();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ signed: !!user, user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

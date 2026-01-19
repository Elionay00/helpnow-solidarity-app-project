import { createContext, useContext, useState, ReactNode } from 'react';

type User = {
  id: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  signIn: (user: User) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  function signIn(userData: User) {
    setUser(userData);
  }

  function signOut() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

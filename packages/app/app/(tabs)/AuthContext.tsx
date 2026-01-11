import React, { createContext, useState, useContext } from 'react';

// Criando o contexto
export const AuthContext = createContext<any>({});

// O segredo para o Stack parar de dar erro é o "{ children }" aqui:
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);

  async function signIn() {
    // Lógica simplificada para teste
    setUser({ name: 'Usuario' } as any);
  }

  return (
    <AuthContext.Provider value={{ signed: !!user, user, signIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}
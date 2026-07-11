import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [web3, setWeb3] = useState(null); // { type: 'local' | 'image', address, account }

  useEffect(() => {
    // Auto-restore local wallet session
    const savedPk = localStorage.getItem('ec_pk');
    if (savedPk && !web3) {
      // We don't create account here to avoid import cycle; CheckInCard handles it
    }
  }, []);

  const signIn = async (userData) => {
    setUser(userData);
  };

  const signOut = () => {
    setUser(null);
    setWeb3(null);
    // Do not clear ec_pk so wallet persists across logins
  };

  const setLocalWeb3 = (data) => setWeb3(data);

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, web3, setWeb3: setLocalWeb3 }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};

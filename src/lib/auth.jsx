import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [web3, setWeb3] = useState(null); // { type: 'local' | 'image', address, account }

  /**
   * Sign in with user data (email or wallet address)
   */
  const signIn = async (userData) => {
    setUser(userData);
  };

  /**
   * Sign out the current session.
   * 
   * IMPORTANT: We deliberately do NOT delete the wallet from localStorage.
   * The wallet (ec_pk) should persist so the user can sign back in later
   * without having to create a new wallet.
   */
  const signOut = () => {
    setUser(null);
    setWeb3(null);
    // Do NOT remove 'ec_pk' — wallet should persist across sessions
  };

  /**
   * Set the Web3 wallet/account (used by CheckInCard after creating or loading a wallet)
   */
  const setLocalWeb3 = (data) => {
    setWeb3(data);
  };

  const value = {
    user,
    web3,
    signIn,
    signOut,
    setWeb3: setLocalWeb3,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
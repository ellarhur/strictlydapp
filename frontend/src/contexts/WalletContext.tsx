import React, { createContext, useContext, ReactNode } from 'react';

interface WalletContextType {
  // Tom för nu - vi bygger om detta
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <WalletContext.Provider value={{}}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet måste användas inom en WalletProvider');
  }
  return context;
};

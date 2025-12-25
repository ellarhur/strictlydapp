import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BrowserProvider, JsonRpcSigner } from 'ethers';

interface WalletContextType {
  address: string | null;          
  provider: BrowserProvider | null;
  signer: JsonRpcSigner | null;
  isConnected: boolean; 
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert('Ingen Web3 wallet hittades! Installera MetaMask eller Coinbase Wallet.');
        return;
      }

      // Enkel anslutning - visar wallet popup automatiskt
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('Ingen account vald');
      }

      const browserProvider = new BrowserProvider(window.ethereum);
      const walletSigner = await browserProvider.getSigner();
      const userAddress = await walletSigner.getAddress();

      setProvider(browserProvider);
      setSigner(walletSigner);
      setAddress(userAddress);
      setIsConnected(true);

      console.log('✅ Wallet ansluten:', userAddress);
    } catch (error: any) {
      console.error('❌ Fel vid anslutning till wallet:', error);
      
      if (error.code === 4001) {
        alert('Du nekade anslutning till wallet');
      } else {
        alert('Kunde inte ansluta till wallet');
      }
    }
  };

  const disconnectWallet = () => {
    // Försök revoke permissions från wallet
    if (window.ethereum?.request) {
      window.ethereum.request({
        method: 'wallet_revokePermissions',
        params: [{ eth_accounts: {} }]
      }).catch(err => console.log('Revoke permissions error (ignoreras):', err));
    }
    
    setAddress(null);
    setProvider(null);
    setSigner(null);
    setIsConnected(false);
    console.log('🔌 Wallet frånkopplad');
  };

  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        connectWallet();
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    window.ethereum.on?.('accountsChanged', handleAccountsChanged);
    window.ethereum.on?.('chainChanged', handleChainChanged);

    return () => {
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  return (
    <WalletContext.Provider 
      value={{ 
        address,          
        provider,       
        signer,         
        isConnected, 
        connectWallet,
        disconnectWallet
      }}
    >
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

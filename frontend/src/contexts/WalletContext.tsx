import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { BrowserProvider, JsonRpcSigner } from 'ethers';
import { NETWORK_CHAIN_ID, NETWORK_NAME } from '../utils/contractConfig';

interface WalletContextType {
  address: string | null;          
  provider: BrowserProvider | null;
  signer: JsonRpcSigner | null;
  isConnected: boolean;
  isLoading: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const STORAGE_KEY = 'strictly_wallet_connected';

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const ensureCorrectNetwork = useCallback(async () => {
    if (!window.ethereum?.request || !NETWORK_CHAIN_ID) return;

    const desiredHex = `0x${NETWORK_CHAIN_ID.toString(16)}`;
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: desiredHex }]
      });
    } catch (err: any) {
      if (err?.code === 4902) {
        alert(`Network "${NETWORK_NAME}" is not added in your wallet. Please add it manually and retry.`);
        return;
      }
      if (err?.code === 4001) {
        alert(`Switch to "${NETWORK_NAME}" in your wallet to use the app.`);
        return;
      }
      // Non-blocking: if auto-switch fails, user can still switch manually.
      console.log('Could not switch network automatically (ignored):', err);
    }
  }, []);

  const disconnectWallet = useCallback(() => {
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
    
    localStorage.removeItem(STORAGE_KEY);
    
    console.log('Wallet disconnected');
  }, []);

  const connectWallet = useCallback(async () => {
    try {
      if (!window.ethereum) {
        alert('No Web3 wallet found. Please install MetaMask or Coinbase Wallet.');
        return;
      }

      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No account selected');
      }

      await ensureCorrectNetwork();

      const browserProvider = new BrowserProvider(window.ethereum);
      const walletSigner = await browserProvider.getSigner();
      const userAddress = await walletSigner.getAddress();

      setProvider(browserProvider);
      setSigner(walletSigner);
      setAddress(userAddress);
      setIsConnected(true);

      localStorage.setItem(STORAGE_KEY, 'true');

      console.log('Wallet connected:', userAddress);
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      
      if (error.code === 4001) {
        alert('You denied the wallet connection request.');
      } else {
        alert('Could not connect to wallet.');
      }
    }
  }, [ensureCorrectNetwork]);

  useEffect(() => {
    const autoConnect = async () => {
      setIsLoading(true);

      const wasConnected = localStorage.getItem(STORAGE_KEY);
      
      if (wasConnected === 'true' && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ 
            method: 'eth_accounts' // Use eth_accounts for silent check instead of eth_requestAccounts
          });

          if (accounts && accounts.length > 0) {
            await ensureCorrectNetwork();
            const browserProvider = new BrowserProvider(window.ethereum);
            const walletSigner = await browserProvider.getSigner();
            const userAddress = await walletSigner.getAddress();

            setProvider(browserProvider);
            setSigner(walletSigner);
            setAddress(userAddress);
            setIsConnected(true);

            console.log('Auto-connected to wallet:', userAddress);
          } else {
            // No account available; clear auto-connect flag
            localStorage.removeItem(STORAGE_KEY);
          }
        } catch (error) {
          console.error('Auto-connect failed:', error);
          localStorage.removeItem(STORAGE_KEY);
        }
      }

      setIsLoading(false);
    };

    autoConnect();
  }, [ensureCorrectNetwork]);

  // Event listeners for account/chain changes
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      console.log('accountsChanged event:', accounts);
      
      if (accounts.length === 0) {
        // User disconnected in wallet
        console.log('No accounts, disconnecting...');
        disconnectWallet();
      } else if (accounts[0].toLowerCase() !== address?.toLowerCase()) {
        // Only reconnect if address actually changed
        console.log('New address detected, reconnecting...');
        connectWallet();
      } else {
        // Same address; ignore (common after transactions)
        console.log('Same address, ignoring event');
      }
    };

    const handleChainChanged = () => {
      console.log('Chain changed, reloading...');
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
  }, [connectWallet, disconnectWallet, address]);

  return (
    <WalletContext.Provider 
      value={{ 
        address,          
        provider,       
        signer,         
        isConnected,
        isLoading,
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
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

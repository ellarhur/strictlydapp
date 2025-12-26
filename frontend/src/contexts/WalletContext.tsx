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
      // 4902 = okänt nätverk i wallet
      if (err?.code === 4902) {
        alert(`Nätverket "${NETWORK_NAME}" finns inte i din wallet. Lägg till det manuellt och försök igen.`);
        return;
      }
      // 4001 = användaren nekade
      if (err?.code === 4001) {
        alert(`Byt till "${NETWORK_NAME}" i din wallet för att använda appen.`);
        return;
      }
      console.log('Kunde inte byta nätverk automatiskt (ignoreras):', err);
    }
  }, []);

  const disconnectWallet = useCallback(() => {
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
    
    // Ta bort från localStorage
    localStorage.removeItem(STORAGE_KEY);
    
    console.log('🔌 Wallet frånkopplad');
  }, []);

  const connectWallet = useCallback(async () => {
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

      // Försök att byta till rätt chain innan vi skapar provider/signer
      await ensureCorrectNetwork();

      const browserProvider = new BrowserProvider(window.ethereum);
      const walletSigner = await browserProvider.getSigner();
      const userAddress = await walletSigner.getAddress();

      setProvider(browserProvider);
      setSigner(walletSigner);
      setAddress(userAddress);
      setIsConnected(true);

      // Spara till localStorage att användaren har connectat
      localStorage.setItem(STORAGE_KEY, 'true');

      console.log('✅ Wallet ansluten:', userAddress);
    } catch (error: any) {
      console.error('❌ Fel vid anslutning till wallet:', error);
      
      if (error.code === 4001) {
        alert('Du nekade anslutning till wallet');
      } else {
        alert('Kunde inte ansluta till wallet');
      }
    }
  }, [ensureCorrectNetwork]);

  // Auto-connect vid mount om användaren var tidigare connectad
  useEffect(() => {
    const autoConnect = async () => {
      setIsLoading(true);

      // Kolla om användaren var tidigare connectad
      const wasConnected = localStorage.getItem(STORAGE_KEY);
      
      if (wasConnected === 'true' && window.ethereum) {
        try {
          // Försök hämta accounts utan popup (om permission redan givits)
          const accounts = await window.ethereum.request({ 
            method: 'eth_accounts' // Använd eth_accounts istället för eth_requestAccounts
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

            console.log('✅ Auto-connectad till wallet:', userAddress);
          } else {
            // Ingen account tillgänglig, rensa localStorage
            localStorage.removeItem(STORAGE_KEY);
          }
        } catch (error) {
          console.error('Auto-connect misslyckades:', error);
          localStorage.removeItem(STORAGE_KEY);
        }
      }

      setIsLoading(false);
    };

    autoConnect();
  }, [ensureCorrectNetwork]);

  // Event listeners för account/chain ändringar
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      console.log('🔄 accountsChanged event:', accounts);
      
      if (accounts.length === 0) {
        // Användaren har disconnectat i MetaMask
        console.log('❌ Inga accounts, disconnectar...');
        disconnectWallet();
      } else if (accounts[0].toLowerCase() !== address?.toLowerCase()) {
        // Endast re-connecta om adressen faktiskt ändrats
        console.log('🔄 Ny adress detekterad, re-connectar...');
        connectWallet();
      } else {
        // Samma adress, ignorera (händer ofta efter transactions)
        console.log('✅ Samma adress, ignorerar event');
      }
    };

    const handleChainChanged = () => {
      console.log('⛓️ Chain ändrades, reloading...');
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
    throw new Error('useWallet måste användas inom en WalletProvider');
  }
  return context;
};

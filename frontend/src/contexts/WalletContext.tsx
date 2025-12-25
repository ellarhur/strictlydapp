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

// 2. Skapa contexten (tom från början)
const WalletContext = createContext<WalletContextType | undefined>(undefined);

// 3. Provider-komponenten som omsluter din app
export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State-variabler för att hålla wallet-info
  const [address, setAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  // 4. Funktion för att ansluta wallet
  const connectWallet = async () => {
    try {
      // Kolla om Metamask/Coinbase finns installerat
      if (!window.ethereum) {
        alert('Vänligen installera Metamask eller Coinbase Wallet!');
        return;
      }

      // Be om tillgång till användarens konton (öppnar Metamask popup)
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });

      // Skapa en ethers.js provider från window.ethereum
      const browserProvider = new BrowserProvider(window.ethereum);
      
      // Hämta signer (den som kan signera transaktioner)
      const walletSigner = await browserProvider.getSigner();
      
      // Hämta användarens adress
      const userAddress = await walletSigner.getAddress();

      // Spara allt i state
      setProvider(browserProvider);
      setSigner(walletSigner);
      setAddress(userAddress);
      setIsConnected(true);

      console.log('Wallet ansluten:', userAddress);
    } catch (error) {
      console.error('Fel vid anslutning till wallet:', error);
      alert('Kunde inte ansluta till wallet');
    }
  };

  // 5. Funktion för att koppla från wallet
  const disconnectWallet = () => {
    setAddress(null);
    setProvider(null);
    setSigner(null);
    setIsConnected(false);
    console.log('Wallet frånkopplad');
  };

  // 6. Lyssna på ändringar i wallet (när användaren byter konto eller nätverk)
  useEffect(() => {
    if (!window.ethereum) return;

    // När användaren byter konto i Metamask
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        // Användaren har kopplat från alla konton
        disconnectWallet();
      } else {
        // Användaren bytte till ett annat konto - anslut igen
        connectWallet();
      }
    };

    // När användaren byter nätverk i Metamask
    const handleChainChanged = () => {
      // Ladda om sidan när nätverk byts (rekommenderat av Metamask)
      window.location.reload();
    };

    // Lägg till event listeners
    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    // Cleanup: ta bort listeners när komponenten unmountas
    return () => {
      if (window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  // 7. Försök återansluta om användaren redan har godkänt tidigare
  useEffect(() => {
    const checkIfWalletIsConnected = async () => {
      if (!window.ethereum) return;

      try {
        // Kolla om vi redan har tillgång till konton (utan att öppna popup)
        const accounts = await window.ethereum.request({ 
          method: 'eth_accounts' 
        });

        if (accounts.length > 0) {
          // Användaren har redan anslutit tidigare - återanslut automatiskt
          await connectWallet();
        }
      } catch (error) {
        console.error('Fel vid kontroll av wallet-anslutning:', error);
      }
    };

    checkIfWalletIsConnected();
  }, []);

  // 8. Returnera provider med alla värden och funktioner
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

// 9. Custom hook för att använda wallet context i andra komponenter
export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet måste användas inom en WalletProvider');
  }
  return context;
};


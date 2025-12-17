import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser, loginUser } from '../utils/localStorage';

const LogIn = () => {
    const navigate = useNavigate();
    const [isRegisterMode, setIsRegisterMode] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [walletAddress, setWalletAddress] = useState('');
    const [availableAccounts, setAvailableAccounts] = useState<string[]>([]);
    const [showAccountSelector, setShowAccountSelector] = useState(false);
    const [message, setMessage] = useState('');

    const handleConnectWallet = async () => {
        try {
            if (typeof window.ethereum === 'undefined') {
                setMessage('Ingen Web3 wallet hittades! Installera MetaMask, Coinbase Wallet eller liknande.');
                return;
            }

            const accounts = await window.ethereum.request({ 
                method: 'eth_requestAccounts' 
            });
            
            if (accounts.length > 0) {
                setAvailableAccounts(accounts);
                
                if (accounts.length > 1) {
                    setShowAccountSelector(true);
                    setMessage(`Hittade ${accounts.length} konton. Välj vilket du vill använda:`);
                } else {
                    setWalletAddress(accounts[0]);
                    setShowAccountSelector(false);
                    
                    const provider = window.ethereum;
                    let walletName = 'Wallet';
                    if (provider.isMetaMask) walletName = 'MetaMask';
                    else if (provider.isCoinbaseWallet) walletName = 'Coinbase Wallet';
                    
                    setMessage(`${walletName} ansluten!`);
                }
            }
        } catch (error: any) {
            console.error('Fel vid anslutning av wallet:', error);
            
            if (error.code === 4001) {
                setMessage('Du nekade anslutning till wallet');
            } else {
                setMessage('Kunde inte ansluta wallet');
            }
        }
    };

    const selectAccount = (account: string) => {
        setWalletAddress(account);
        setShowAccountSelector(false);
        
        const provider = window.ethereum;
        let walletName = 'Wallet';
        if (provider?.isMetaMask) walletName = 'MetaMask';
        else if (provider?.isCoinbaseWallet) walletName = 'Coinbase Wallet';
        
        setMessage(`${walletName} ansluten!`);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!username || !password) {
            setMessage('Fyll i alla fält');
            return;
        }

        if (isRegisterMode) {
            if (!walletAddress) {
                setMessage('Anslut din wallet först');
                return;
            }

            const result = registerUser(username, password, walletAddress);
            setMessage(result.message);

            if (result.success) {
                setTimeout(() => {
                    navigate('/ListenerDashboard');
                }, 1000);
            }
        } else {
            const result = loginUser(username, password);
            setMessage(result.message);

            if (result.success) {
                setTimeout(() => {
                    navigate('/ListenerDashboard');
                }, 1000);
            }
        }
    };

    return (
        <>
            <div className="landing-page-gradient"></div>
            <div className="introduction">
                <h1>Strictly</h1>
                <p>Support your favourite artists directly.</p>
                
                <div className="login-form-container">
                    <h2>{isRegisterMode ? 'Registrera' : 'Logga in'}</h2>
                    
                    <form onSubmit={handleSubmit} className="login-form">
                        <input
                            type="text"
                            placeholder="Användarnamn"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="login-input"
                        />
                        
                        <input
                            type="password"
                            placeholder="Lösenord"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="login-input"
                        />
                        
                        {isRegisterMode && (
                            <>
                                <button 
                                    type="button"
                                    onClick={handleConnectWallet}
                                    className="wallet-button"
                                >
                                    {walletAddress ? `Ansluten: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Anslut Wallet'}
                                </button>
                                
                                {showAccountSelector && availableAccounts.length > 0 && (
                                    <div className="account-selector">
                                        <p className="account-selector-title">Välj konto:</p>
                                        {availableAccounts.map((account, index) => (
                                            <button
                                                key={account}
                                                type="button"
                                                onClick={() => selectAccount(account)}
                                                className="account-button"
                                            >
                                                Konto {index + 1}: {account.slice(0, 10)}...{account.slice(-8)}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                        
                        <button 
                            type="submit"
                            className="getstarted-button login-submit-button"
                        >
                            {isRegisterMode ? 'Registrera' : 'Logga in'}
                        </button>
                    </form>
                    
                    <p className="toggle-text">
                        {isRegisterMode ? 'Har du redan ett konto?' : 'Har du inget konto?'}
                        {' '}
                        <button 
                            onClick={() => {
                                setIsRegisterMode(!isRegisterMode);
                                setMessage('');
                            }}
                            className="toggle-link"
                        >
                            {isRegisterMode ? 'Logga in här' : 'Registrera dig här'}
                        </button>
                    </p>
                    
                    {message && (
                        <p className={`message ${message.includes('lyckades') ? 'success' : 'error'}`}>
                            {message}
                        </p>
                    )}
                </div>
            </div>
        </>
    )
}

export default LogIn;
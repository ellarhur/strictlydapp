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
                    
                    setMessage(`${walletName} connected!`);
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
        
        setMessage(`${walletName} connected!`);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!username || !password) {
            setMessage('Fill in all fields');
            return;
        }

        if (isRegisterMode) {
            if (!walletAddress) {
                setMessage('Connect your wallet first');
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
                    <h2>{isRegisterMode ? 'Register' : 'Log in'}</h2>
                    
                    <form onSubmit={handleSubmit} className="login-form">
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="login-input"
                        />
                        
                        <input
                            type="password"
                            placeholder="Password"
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
                                    {walletAddress ? `Connected: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Connect Wallet'}
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
                            {isRegisterMode ? 'Register' : 'Log in'}
                        </button>
                    </form>
                    
                    <p className="toggle-text">
                        {isRegisterMode ? 'Do you already have an account?' : 'Do you not have an account?'}
                        {' '}
                        <button 
                            onClick={() => {
                                setIsRegisterMode(!isRegisterMode);
                                setMessage('');
                            }}
                            className="toggle-link"
                        >
                            {isRegisterMode ? 'Log in' : 'Register here'}
                        </button>
                    </p>
                    
                    {message && (
                        <p className={`message ${message.includes('success') ? 'success' : 'error'}`}>
                            {message}
                        </p>
                    )}
                </div>
            </div>
        </>
    )
}

export default LogIn;
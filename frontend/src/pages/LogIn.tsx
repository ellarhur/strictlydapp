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

            // Detta öppnar MetaMask/Coinbase popup där användaren väljer konto
            const accounts = await window.ethereum.request({ 
                method: 'eth_requestAccounts' 
            });
            
            if (accounts.length > 0) {
                setAvailableAccounts(accounts);
                
                // Om användaren har flera konton, visa val
                if (accounts.length > 1) {
                    setShowAccountSelector(true);
                    setMessage(`Hittade ${accounts.length} konton. Välj vilket du vill använda:`);
                } else {
                    // Bara ett konto, använd det direkt
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
                
                <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                    <h2>{isRegisterMode ? 'Registrera' : 'Logga in'}</h2>
                    
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <input
                            type="text"
                            placeholder="Användarnamn"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                        />
                        
                        <input
                            type="password"
                            placeholder="Lösenord"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                        />
                        
                        {isRegisterMode && (
                            <>
                                <button 
                                    type="button"
                                    onClick={handleConnectWallet}
                                    style={{ padding: '10px', borderRadius: '5px', cursor: 'pointer' }}
                                >
                                    {walletAddress ? `Ansluten: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Anslut Wallet'}
                                </button>
                                
                                {showAccountSelector && availableAccounts.length > 0 && (
                                    <div style={{ 
                                        marginTop: '10px', 
                                        padding: '10px', 
                                        border: '1px solid #ccc', 
                                        borderRadius: '5px',
                                        backgroundColor: '#f9f9f9'
                                    }}>
                                        <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>Välj konto:</p>
                                        {availableAccounts.map((account, index) => (
                                            <button
                                                key={account}
                                                type="button"
                                                onClick={() => selectAccount(account)}
                                                style={{
                                                    display: 'block',
                                                    width: '100%',
                                                    padding: '8px',
                                                    marginBottom: '5px',
                                                    cursor: 'pointer',
                                                    borderRadius: '3px',
                                                    border: '1px solid #ddd',
                                                    backgroundColor: 'white',
                                                    textAlign: 'left'
                                                }}
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
                            className="getstarted-button"
                            style={{ padding: '10px', borderRadius: '5px', cursor: 'pointer' }}
                        >
                            {isRegisterMode ? 'Registrera' : 'Logga in'}
                        </button>
                    </form>
                    
                    <p style={{ marginTop: '15px' }}>
                        {isRegisterMode ? 'Har du redan ett konto?' : 'Har du inget konto?'}
                        {' '}
                        <button 
                            onClick={() => {
                                setIsRegisterMode(!isRegisterMode);
                                setMessage('');
                            }}
                            style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}
                        >
                            {isRegisterMode ? 'Logga in här' : 'Registrera dig här'}
                        </button>
                    </p>
                    
                    {message && (
                        <p style={{ 
                            marginTop: '15px', 
                            color: message.includes('lyckades') ? 'green' : 'red' 
                        }}>
                            {message}
                        </p>
                    )}
                </div>
            </div>
            <div className="landingpage-design">
                <img src="/assets/landingpage-design.png" alt="Strictly landing page design" /> 
            </div>
        </>
    )
}

export default LogIn;
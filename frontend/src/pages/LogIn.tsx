import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';

const LogIn = () => {
    const navigate = useNavigate();
    const { address, isConnected, connectWallet, disconnectWallet } = useWallet();
    const [message, setMessage] = useState('');
    const [isConnecting, setIsConnecting] = useState(false);

    const handleConnectWallet = async () => {
        setIsConnecting(true);
        setMessage('');

        try {
            if (typeof window.ethereum === 'undefined') {
                setMessage('❌ Ingen Web3 wallet hittades! Installera MetaMask eller Coinbase Wallet.');
                setIsConnecting(false);
                return;
            }

            await connectWallet();
            setMessage('✅ Wallet ansluten!');
            setIsConnecting(false);
            
        } catch (error: any) {
            console.error('Fel vid anslutning av wallet:', error);
            
            if (error.code === 4001) {
                setMessage('❌ Du nekade anslutning till wallet');
            } else {
                setMessage('❌ Kunde inte ansluta wallet. Försök igen.');
            }
            setIsConnecting(false);
        }
    };

    const handleContinue = () => {
        navigate('/ListenerDashboard');
    };

    return (
        <>
            <div className="landing-page-gradient"></div>
            <div className="introduction">
                <h1>Strictly</h1>
                <p>Support your favourite artists directly.</p>
                
                {isConnected && address && (
                    <div className="already-connected-warning">
                        <p>⚠️ En wallet är redan ansluten</p>
                        <p className="wallet-address-small">{address.slice(0, 6)}...{address.slice(-4)}</p>
                        <button 
                            onClick={disconnectWallet}
                            className="disconnect-button-small"
                        >
                            Koppla från
                        </button>
                    </div>
                )}

                {!isConnected ? (
                    <button 
                        onClick={handleConnectWallet}
                        disabled={isConnecting}
                        className="connect-wallet-button"
                    >
                        {isConnecting ? '🔄 Ansluter...' : '🔗 Anslut Wallet'}
                    </button>
                ) : (
                    <div className="wallet-connected-container">
                        <div className="wallet-connected-box">
                            <p className="wallet-connected-title">
                                ✅ Wallet ansluten!
                            </p>
                            <p className="wallet-connected-text">
                                Din anslutna adress:
                            </p>
                            <p className="wallet-address">
                                {address}
                            </p>
                        </div>
                        
                        <button 
                            onClick={handleContinue}
                            className="continue-button"
                        >
                            ➜ Gå vidare till Strictly
                        </button>
                    </div>
                )}
                
                {message && (
                    <p className={`login-message ${message.includes('✅') ? 'success' : 'error'}`}>
                        {message}
                    </p>
                )}
            </div>
        </>
    )
}

export default LogIn;

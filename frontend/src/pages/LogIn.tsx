import { useNavigate } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';

const LogIn = () => {
    const navigate = useNavigate();
    const { address, isConnected, connectWallet, disconnectWallet } = useWallet();

    const handleConnect = async () => {
        if (!isConnected) {
            await connectWallet();
        }
    };

    const handleDisconnect = () => {
        disconnectWallet();
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

                {!isConnected ? (
                    <button 
                        onClick={handleConnect}
                        className="connect-wallet-button"
                    >
                        🔗 Anslut Wallet
                    </button>
                ) : (
                    <div className="wallet-connected-container">
                        <div className="wallet-connected-box">
                            <p className="wallet-connected-title">
                                ✅ Wallet ansluten!
                            </p>
                            <p className="wallet-address">
                                {address}
                            </p>
                            <button 
                                onClick={handleDisconnect}
                                className="disconnect-button"
                            >
                                🔌 Koppla från
                            </button>
                        </div>
                        
                        <button 
                            onClick={handleContinue}
                            className="continue-button"
                        >
                            Continue to Strictly ➜
                        </button>
                    </div>
                )}
            </div>
        </>
    )
}

export default LogIn;

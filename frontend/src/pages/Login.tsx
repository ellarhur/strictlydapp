import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import '../index.css';

const Login = () => {
    const navigate = useNavigate();
    const { isConnected, isLoading, connectWallet } = useWallet();

    // Om wallet redan är ansluten, redirecta direkt (vänta på loading)
    useEffect(() => {
        if (!isLoading && isConnected) {
            navigate('/ListenerDashboard');
        }
    }, [isLoading, isConnected, navigate]);

    const handleConnectWallet = async () => {
        await connectWallet();
        // Efter lyckad anslutning kommer useEffect att redirecta
    };

    // Visa loading medan vi kollar auto-connect
    if (isLoading) {
        return (
            <>
                <div className="landing-page-gradient"></div>
                <div className="home-container">
                    <div className="introduction">
                        <h1>Loading...</h1>
                        <p>Checking wallet connection...</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="landing-page-gradient"></div>
            <div className="home-container">
                <div className="introduction">
                    <h1>Connect Your Wallet</h1>
                    <p>Connect your wallet to start listening and supporting artists.</p>
                    
                    <button 
                        onClick={handleConnectWallet}
                        className="getstarted-button"
                    >
                        Connect Wallet
                    </button>

                    <div className="wallet-info">
                        <p className="wallet-info-text">
                            We support MetaMask, Coinbase Wallet, and other Web3 wallets.
                        </p>
                        <p className="wallet-info-text">
                            Make sure you're on the Base Sepolia network.
                        </p>
                    </div>

                    <button 
                        onClick={() => navigate('/')}
                        className="back-button"
                    >
                        ← Back to Home
                    </button>
                </div>
            </div>
        </>
    );
};

export default Login;


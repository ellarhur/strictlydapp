import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import { NETWORK_NAME } from '../utils/contractConfig';
import '../index.css';

const Login = () => {
    const navigate = useNavigate();
    const { isConnected, isLoading, connectWallet } = useWallet();

    // If wallet is already connected, redirect immediately (after loading)
    useEffect(() => {
        if (!isLoading && isConnected) {
            navigate('/ListenerDashboard');
        }
    }, [isLoading, isConnected, navigate]);

    const handleConnectWallet = async () => {
        await connectWallet();
        // After successful connection, the useEffect above will redirect
    };

    // Show loading while we check auto-connect
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
                    
                    <button 
                        onClick={handleConnectWallet}
                        className="getstarted-button"
                    >
                        Connect Wallet
                    </button>
                </div>
            </div>
        </>
    );
};

export default Login;


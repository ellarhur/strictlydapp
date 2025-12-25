import '../index.css';
import { useWallet } from '../contexts/WalletContext';

const Navbar = () => {
    const { address, isConnected, disconnectWallet } = useWallet();

    const handleDisconnect = () => {
        disconnectWallet();
        // Redirect till login efter disconnect
        window.location.href = '/login';
    };

    return (
        <nav>
            <ul>
                <li><a href="/ListenerDashboard">Home</a></li>
                <li><a href="/Balance">Balance</a></li>
                {isConnected && (
                    <li>
                        <span className="navbar-wallet">
                            {address?.slice(0, 6)}...{address?.slice(-4)}
                        </span>
                    </li>
                )}
                <li>
                    <button onClick={handleDisconnect} className="navbar-disconnect-btn">
                        🔌 Koppla från
                    </button>
                </li>
            </ul>
        </nav>
    )
}

export default Navbar;
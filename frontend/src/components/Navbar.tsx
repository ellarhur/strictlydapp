import '../index.css';
import { useWallet } from '../contexts/WalletContext';

const Navbar = () => {
    const { disconnectWallet } = useWallet();

    const handleDisconnect = () => {
        disconnectWallet();
        // Redirect till home efter disconnect
        window.location.href = '/';
    };

    return (
        <nav>
            <ul>
                <li><a href="/ListenerDashboard">Home</a></li>
                <li><a href="/Balance">Balance</a></li>
                <li>
                    <a onClick={handleDisconnect}>
                    Log out
                    </a>
                </li>
            </ul>
        </nav>
    )
}

export default Navbar;
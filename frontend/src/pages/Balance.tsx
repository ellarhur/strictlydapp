import Navbar from '../components/Navbar';
import { useTracks } from '../contexts/TracksContext';
import { useWallet } from '../contexts/WalletContext';
import ModeButton from '../components/ModeButton';
import '../index.css';

const Balance = () => {
    const { currentTrack } = useTracks();
    const { address, isConnected, connectWallet } = useWallet();

    const handleSubscribe = () => {
        alert('Subscription functionality coming soon!');
    };

    return (
        <>
            <ModeButton />
            <div className="logo"><a href="/ListenerDashboard">Strictly</a></div>
            <Navbar />
            
            <h1 className="dashboard-title">Balance & Subscription</h1>
            
            <div className="dashboard-layout">
                <div className="main-content">
                    <div className="recommended-tracks">
                        <h2>Premium Subscription</h2>
                        
                        <div className="subscription-box">
                            <div className="subscription-cost-section">
                                <h3 className="subscription-cost-title">Subscription Cost</h3>
                                <p className="subscription-price">
                                    0.01 ETH / month
                                </p>
                                <p className="subscription-price-sek">
                                    ≈ 270 SEK per month
                                </p>
                            </div>
                            {isConnected ? (
  <button 
    onClick={handleSubscribe}
    className="subscribe-button"
  >
    Subscribe Now
  </button>
) : (
  <button 
    onClick={connectWallet}  // Från useWallet hook
    className="connect-wallet-button"
  >
    Connect Wallet
  </button>
)}
                        </div>

                        <div className="distribution-box">
                            <h3 className="distribution-title">How We Distribute Your Money</h3>
                            
                            <div className="distribution-item">
                                <div className="distribution-label">
                                    <span>Artists You Listen To</span>
                                    <span className="distribution-percentage">100%</span>
                                </div>
                                <div className="distribution-bar-container">
                                    <div className="distribution-bar"></div>
                                </div>
                            </div>

                            <p className="distribution-description">
                                100% of your subscription goes directly to the artists you listen to! 
                                Your payment is distributed proportionally based on your listening time. 
                                The more you listen to an artist, the more they earn from your subscription. 
                                All payments are processed transparently on the blockchain.
                            </p>
                        </div>

                        {isConnected && (
                            <div className="wallet-info-box">
                                <p className="wallet-info-label">
                                    Connected Wallet:
                                </p>
                                <p className="wallet-info-address">
                                    {address}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="sidebar-player">
                    <div className="streaming-window">
                        <h2>Now Playing...</h2>
                        {currentTrack ? (
                            <>
                                <img src={currentTrack.imageUrl || "/assets/track-1.jpg"} alt={currentTrack.title} />
                                <div className="player-controls">
                                    <button className="from-beginning">⏮</button>
                                    <button className="pause">⏸</button>
                                    <button className="skip">⏭</button>
                                </div>
                                <p className="track-name">{currentTrack.title}</p>
                                <p className="artist-name">{currentTrack.artist}</p>
                                <p className="genre-tag">{currentTrack.genre}</p>
                            </>
                        ) : (
                            <p className="no-track-message">Pick a song to listen to!</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Balance;

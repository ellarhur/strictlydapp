import Navbar from '../components/Navbar';
import { useTracks } from '../contexts/TracksContext';
import { useWallet } from '../contexts/WalletContext';
import ModeButton from '../components/ModeButton';
import '../index.css';

const Balance = () => {
    const { tracks, currentTrack, setCurrentTrack } = useTracks();
    const { address, isConnected } = useWallet();

    const handleTrackClick = (trackId: number) => {
        const track = tracks.find(t => t.id === trackId);
        if (track) {
            setCurrentTrack(track);
        }
    };

    const handleSubscribe = () => {
        // Smart contract functionality will be added later
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
                    {/* Subscription Status */}
                    <div className="recommended-tracks">
                        <h2>💎 Premium Subscription</h2>
                        
                        <div style={{ 
                            background: 'rgba(255, 255, 255, 0.05)', 
                            padding: '24px', 
                            borderRadius: '12px',
                            marginBottom: '20px'
                        }}>
                            <div style={{ marginBottom: '20px' }}>
                                <h3 style={{ marginBottom: '10px', fontSize: '20px' }}>Subscription Cost</h3>
                                <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#00ff88', margin: '10px 0' }}>
                                    0.1 ETH / month
                                </p>
                                <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px' }}>
                                    ≈ 300 SEK per month
                                </p>
                            </div>

                            {isConnected ? (
                                <button 
                                    onClick={handleSubscribe}
                                    style={{
                                        background: 'linear-gradient(135deg, #00ff88 0%, #00cc88 100%)',
                                        color: '#000',
                                        padding: '15px 40px',
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        width: '100%',
                                        marginTop: '10px'
                                    }}
                                >
                                    🚀 Subscribe Now
                                </button>
                            ) : (
                                <p style={{ 
                                    color: '#ff6b6b', 
                                    padding: '15px',
                                    background: 'rgba(255, 107, 107, 0.1)',
                                    borderRadius: '8px',
                                    marginTop: '10px'
                                }}>
                                    ⚠️ Please connect your wallet to subscribe
                                </p>
                            )}
                        </div>

                        {/* How Strictly Distributes Money */}
                        <div style={{ 
                            background: 'rgba(255, 255, 255, 0.03)', 
                            padding: '24px', 
                            borderRadius: '12px'
                        }}>
                            <h3 style={{ marginBottom: '15px', fontSize: '20px' }}>💸 How We Distribute Your Money</h3>
                            
                            <div style={{ marginBottom: '15px' }}>
                                <div style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between',
                                    marginBottom: '8px'
                                }}>
                                    <span>🎵 Artists You Listen To</span>
                                    <span style={{ color: '#00ff88', fontWeight: 'bold' }}>100%</span>
                                </div>
                                <div style={{ 
                                    background: 'rgba(255, 255, 255, 0.1)', 
                                    height: '8px', 
                                    borderRadius: '4px',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{ 
                                        background: '#00ff88', 
                                        width: '100%', 
                                        height: '100%' 
                                    }}></div>
                                </div>
                            </div>

                            <p style={{ 
                                marginTop: '20px', 
                                fontSize: '14px', 
                                color: 'rgba(255, 255, 255, 0.7)',
                                lineHeight: '1.6'
                            }}>
                                100% of your subscription goes directly to the artists you listen to! 
                                Your payment is distributed proportionally based on your listening time. 
                                The more you listen to an artist, the more they earn from your subscription. 
                                All payments are processed transparently on the blockchain.
                            </p>
                        </div>

                        {/* Wallet Info */}
                        {isConnected && (
                            <div style={{ 
                                background: 'rgba(0, 255, 136, 0.05)', 
                                padding: '16px', 
                                borderRadius: '8px',
                                marginTop: '20px',
                                border: '1px solid rgba(0, 255, 136, 0.2)'
                            }}>
                                <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '5px' }}>
                                    Connected Wallet:
                                </p>
                                <p style={{ 
                                    fontFamily: 'monospace', 
                                    fontSize: '14px',
                                    color: '#00ff88'
                                }}>
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

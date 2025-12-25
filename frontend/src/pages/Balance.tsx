import Navbar from '../components/Navbar';
import { useTracks } from '../contexts/TracksContext';
import '../index.css';

const Balance = () => {
    const { tracks, currentTrack, setCurrentTrack } = useTracks();

    const handleTrackClick = (trackId: number) => {
        const track = tracks.find(t => t.id === trackId);
        if (track) {
            setCurrentTrack(track);
        }
    };

    return (
        <>
            <div className="logo"><a href="/ListenerDashboard">Strictly</a></div>
            <Navbar />
            
            <h1 className="dashboard-title">Balance</h1>
            
            <div className="dashboard-layout">
                <div className="main-content">
                    <div className="recommended-tracks">
                        <h2>Prenumerationsstatus</h2>
                        <p>Wallet-funktionalitet kommer snart...</p>
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

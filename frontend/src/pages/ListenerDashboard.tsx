import Navbar from '../components/Navbar';
import { useTracks } from '../contexts/TracksContext';
import ModeButton from '../components/ModeButton';
import '../index.css';

const ListenerDashboard = () => {
    const { tracks, currentTrack, setCurrentTrack } = useTracks();

    const handleTrackClick = (trackId: number) => {
        const track = tracks.find(t => t.id === trackId);
        if (track) {
            setCurrentTrack(track);
        }
    };

    return (
        <>
            <Navbar />
            <h1>Listen to your favourite tracks</h1>
            <div className="recommended-tracks">
                <h2>Today's top hits</h2>
                {tracks.slice(0, 3).map(track => (
                    <div 
                        key={track.id} 
                        className="trackcard clickable"
                        onClick={() => handleTrackClick(track.id)}
                    >
                        <img src={track.imageUrl || "/assets/track-1.jpg"} alt={track.title} />
                        <h3>{track.title}</h3>
                        <p>{track.artist}</p>
                    </div>
                ))}
            </div>
            
            <ModeButton />
            
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
                    <p style={{ color: '#aaa' }}>Välj en låt för att börja spela...</p>
                )}
            </div>
        </>
    )
}

export default ListenerDashboard;
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useTracks } from '../contexts/TracksContext';
import { useWallet } from '../contexts/WalletContext';
import { useStrictlyContract } from '../hooks/useStrictlyContract';
import ModeButton from '../components/ModeButton';
import '../index.css';

const ListenerDashboard = () => {
    const navigate = useNavigate();
    const { tracks, currentTrack, setCurrentTrack } = useTracks();
    const { isConnected, isLoading: walletLoading, signer, address } = useWallet();
    const contract = useStrictlyContract(signer);
    const [hasSubscription, setHasSubscription] = useState(false);

    // Redirect to login if not connected (after loading)
    useEffect(() => {
        if (!walletLoading && !isConnected) {
            navigate('/login');
        }
    }, [walletLoading, isConnected, navigate]);

    // Check subscription status
    useEffect(() => {
        const checkSubscription = async () => {
            if (!contract || !address) return;

            try {
                const hasSub = await contract.hasActiveSubscription(address);
                setHasSubscription(hasSub);
            } catch (error) {
                console.error('Error checking subscription:', error);
            }
        };

        checkSubscription();
    }, [contract, address]);

    const handleTrackClick = async (trackId: number) => {
        if (!contract) {
            alert('Contract not connected!');
            return;
        }

        if (!hasSubscription) {
            alert('You need an active subscription to play tracks! Go to Balance to subscribe.');
            return;
        }

        try {
            // 1. Register play in contract (blockchain transaction)
            console.log(`Recording play for track ${trackId}...`);
            const tx = await contract.playTrack(trackId);
            console.log('Play recorded, transaction hash:', tx.hash);
            
            // Wait for confirmation (optional — could also continue)
            await tx.wait();
            console.log('Play confirmed on blockchain');

            // 2. Set track as current in UI
            const track = tracks.find(t => t.id === trackId);
            if (track) {
                setCurrentTrack(track);
            }

        } catch (error: any) {
            console.error('Error playing track:', error);
            
            if (error.code === 'ACTION_REJECTED' || error.code === 4001) {
                alert('You cancelled the play transaction');
            } else if (error.message?.includes('subscription inactive')) {
                alert('Your subscription is not active! Go to Balance to subscribe.');
            } else if (error.message?.includes('track not released')) {
                alert('This track is not released yet!');
            } else if (error.message?.includes('track missing')) {
                alert('Track not found in contract');
            } else {
                alert(`Error playing track: ${error.message || 'Unknown error'}`);
            }
        }
    };

    return (
        <>
            <div className="logo"><a href="/ListenerDashboard">Strictly</a></div>
            <Navbar />
            <ModeButton />
            
            <h1 className="dashboard-title">Listen to your favourite tracks</h1>
            
            <div className="dashboard-layout">
                <div className="main-content">
                    <div className="recommended-tracks">
                        <h2>Latest uploaded tracks {hasSubscription}</h2>
                        {tracks.slice().reverse().slice(0, 3).map(track => (
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

export default ListenerDashboard;
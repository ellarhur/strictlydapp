import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import UploadForm from '../components/UploadForm';
import ModeButton from '../components/ModeButton';
import { useTracks } from '../contexts/TracksContext';
import { useWallet } from '../contexts/WalletContext';
import { useStrictlyContract } from '../hooks/useStrictlyContract';
import { Track } from '../types/track';
import '../index.css';

const CreatorDashboard = () => {
  const navigate = useNavigate();
  const { tracks, addTrack } = useTracks();
  const { address, isConnected, isLoading: walletLoading, signer } = useWallet();
  const contract = useStrictlyContract(signer);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [totalTrackCount, setTotalTrackCount] = useState<number>(0);

  // Redirect to login if not connected (after loading)
  useEffect(() => {
    if (!walletLoading && !isConnected) {
      navigate('/login');
    }
  }, [walletLoading, isConnected, navigate]);

  // Fetch total track count from the contract
  useEffect(() => {
    const fetchTrackCount = async () => {
      if (!contract) return;

      try {
        const count = await contract.trackCount();
        setTotalTrackCount(Number(count));
      } catch (error) {
        console.error('Error fetching track count:', error);
      }
    };

    fetchTrackCount();
  }, [contract]);

  const handleUpload = (newTrack: Track) => {
    addTrack(newTrack);
    setShowUploadForm(false);
    alert(`Track "${newTrack.title}" uploaded successfully!`);
  };

  const myTracks = tracks.filter(track => track.uploader === address);

  return (
    <>
      <div className="logo"><a href="/ListenerDashboard">Strictly</a></div>
      <Navbar />
      <ModeButton />
            
      <h1 className="dashboard-title">Upload your tracks</h1>
      
      <div className="dashboard-layout">
        <div className="main-content">
          <div className="wallet-info-box" style={{ marginBottom: '20px' }}>
          </div>

          <div className="recommended-tracks">
            <h2>My Tracks ({myTracks.length})</h2>
            {myTracks.map((track, index) => (
              <div key={track.id} className="trackcard">
                <span className="track-number">{index + 1}</span>
                <img src={track.imageUrl || "/assets/track-1.jpg"} alt={track.title} />
                <div className="track-info">
                  <h3>{track.title}</h3>
                  <p>{track.artist}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="sidebar-player">
          <div className="streaming-window">
          <button 
            className="upload-button"
            onClick={() => setShowUploadForm(!showUploadForm)}
          >
            {showUploadForm ? 'Cancel' : 'Upload New Track'}
          </button>

          {showUploadForm && <UploadForm onUpload={handleUpload} />}
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatorDashboard;

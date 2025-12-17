import { useState } from 'react';
import Navbar from '../components/Navbar';
import UploadForm from '../components/UploadForm';
import ModeButton from '../components/ModeButton';
import { useTracks } from '../contexts/TracksContext';
import { TrackFormData, Track } from '../types/track';
import '../index.css';

const CreatorDashboard = () => {
  const { tracks, addTrack, currentTrack } = useTracks();
  const [showUploadForm, setShowUploadForm] = useState(false);

  const handleUpload = (trackData: TrackFormData) => {
    const newTrack: Track = {
      id: tracks.length + 1,
      ...trackData,
      uploader: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1",
      exists: true
    };
    
    addTrack(newTrack);
    setShowUploadForm(false);
    alert(`Track "${trackData.title}" uploaded successfully!`);
  };

  const myTracks = tracks.filter(track => track.uploader === "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1");

  return (
    <>
      <div className="logo"><a href="/ListenerDashboard">Strictly</a></div>
      <Navbar />
      <ModeButton />
            
      <h1 className="dashboard-title">Upload your tracks</h1>
      
      <div className="dashboard-layout">
        <div className="main-content">
        

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

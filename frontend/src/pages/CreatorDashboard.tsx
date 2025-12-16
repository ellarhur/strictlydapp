import { useState } from 'react';
import Navbar from '../components/Navbar';
import UploadForm from '../components/UploadForm';
import ModeButton from '../components/ModeButton';
import { useTracks } from '../contexts/TracksContext';
import { TrackFormData, Track } from '../types/track';
import '../index.css';

const CreatorDashboard = () => {
  const { tracks, addTrack } = useTracks();
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
      
      <div className="main-content">
        <h1>Creator Dashboard</h1>
        <p>Welcome to your artist space</p>

        <ModeButton />

        <button 
          className="upload-button"
          onClick={() => setShowUploadForm(!showUploadForm)}
        >
          {showUploadForm ? 'Cancel' : 'Upload New Track'}
        </button>

        {showUploadForm && <UploadForm onUpload={handleUpload} />}

        <div className="my-tracks">
          <h2>My Tracks ({myTracks.length})</h2>
          <div className="tracks-grid">
            {myTracks.map(track => (
              <div key={track.id} className="trackcard">
                <img src={track.imageUrl || "/assets/track-1.jpg"} alt={track.title} />
                <h3>{track.title}</h3>
                <p>{track.artist}</p>
                <p className="genre">{track.genre}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatorDashboard;

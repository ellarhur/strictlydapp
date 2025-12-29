import { useState } from 'react';
import { TrackFormData, Track } from '../types/track';
import '../index.css';
import { useWallet } from '../contexts/WalletContext';
import { useStrictlyContract } from '../hooks/useStrictlyContract';

interface UploadFormProps {
  onUpload: (track: Track) => void;
}

const UploadForm: React.FC<UploadFormProps> = ({ onUpload }) => {
  const { signer, address } = useWallet();
  const contract = useStrictlyContract(signer);
  const [formData, setFormData] = useState<TrackFormData>({
    title: '',
    artist: '',
    album: '',
    genre: '',
    royaltyWallet: '',
    releaseDate: Date.now(),
    imageUrl: '',
    audioUrl: ''
  });

  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [hasConfirmedRights, setHasConfirmedRights] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contract || !signer) {
      setError('Make sure your wallet is connected!');
      return;
    }

    if (!hasConfirmedRights) {
      setError('Please confirm ownership/licensing before uploading.');
      return;
    }

    if (!formData.royaltyWallet.startsWith('0x') || formData.royaltyWallet.length !== 42) {
      setError('Invalid wallet address');
      return;
    }

    setIsUploading(true);
    setError('');
    setSuccessMessage('');

    try {
      console.log('Making transaction on blockchain', formData);

      const tx = await contract.addTrack(
        formData.title,
        formData.artist,
        formData.album,
        formData.genre,
        formData.royaltyWallet,
        Math.floor(formData.releaseDate / 1000)
      );

      console.log('Song uploaded, hash:', tx.hash);
      setSuccessMessage('Wating for confirmation');

      const receipt = await tx.wait();

      console.log('Completed!', receipt);

      setSuccessMessage('Thank you for adding your song');

      let onChainTrackId: number | null = null;
      try {
        for (const log of receipt?.logs || []) {
          if (!log || !log.address) continue;
          if (log.address.toLowerCase() !== (await contract.getAddress()).toLowerCase()) continue;
          try {
            const parsed = contract.interface.parseLog(log);
            if (parsed?.name === 'TrackAdded') {
              onChainTrackId = Number(parsed.args.trackId);
              break;
            }
          } catch {
            
          }
        }
      } catch {
        
      }

      if (onChainTrackId === null) {
        const count = await contract.trackCount();
        onChainTrackId = Math.max(0, Number(count) - 1);
      }

      const newTrack: Track = {
        id: onChainTrackId,
        ...formData,
        uploader: address || '',
        exists: true,
      };

      onUpload(newTrack);

      setTimeout(() => {
        setFormData({
          title: '',
          artist: '',
          album: '',
          genre: '',
          royaltyWallet: '',
          releaseDate: Date.now(),
          imageUrl: '',
          audioUrl: ''
        });
        setHasConfirmedRights(false);
        setSuccessMessage('');
      }, 2000); 

    } catch (err: any) {
      console.error('Something went wrong:', err);
      
      if (err.code === 'ACTION_REJECTED' || err.code === 4001) {
        setError('You cancelled the call');
      } else if (err.message?.includes('title required')) {
        setError('Must have a title');
      } else if (err.message?.includes('wallet required')) {
        setError('Must set a royalty wallet');
      } else {
        setError(`Something went wrong: ${err.message || 'Unknown'}`);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasConfirmedRights(e.target.checked);
  };

  return (
    <form onSubmit={handleSubmit} className="upload-form">
      <h2>Upload Track</h2>
      
      <div className="form-group">
        <label htmlFor="title">Track Title *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          disabled={isUploading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="artist">Artist Name *</label>
        <input
          type="text"
          id="artist"
          name="artist"
          value={formData.artist}
          onChange={handleChange}
          required
          disabled={isUploading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="album">Album</label>
        <input
          type="text"
          id="album"
          name="album"
          value={formData.album}
          onChange={handleChange}
          disabled={isUploading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="genre">Genre *</label>
        <select
          id="genre"
          name="genre"
          value={formData.genre}
          onChange={handleChange}
          required
          disabled={isUploading}
        >
          <option value="">Select Genre</option>
          <option value="Electronic">Electronic</option>
          <option value="Hip-Hop">Hip-Hop</option>
          <option value="Rock">Rock</option>
          <option value="Pop">Pop</option>
          <option value="Jazz">Jazz</option>
          <option value="Classical">Classical</option>
          <option value="Ambient">Ambient</option>
          <option value="Alternative">Alternative</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="royaltyWallet">Royalty Wallet Address *</label>
        <input
          type="text"
          id="royaltyWallet"
          name="royaltyWallet"
          value={formData.royaltyWallet}
          onChange={handleChange}
          placeholder="0x..."
          required
          disabled={isUploading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="imageUrl">Cover Image URL</label>
        <input
          type="text"
          id="imageUrl"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          placeholder="https://..."
          disabled={isUploading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="rightsConfirmation">
          <input
            type="checkbox"
            id="rightsConfirmation"
            name="rightsConfirmation"
            checked={hasConfirmedRights}
            onChange={handleConfirmChange}
            disabled={isUploading}
            required
          />
          {' '} <br />
          I confirm I own or have licensed the rights to upload this track.
        </label>
      </div>

      <button 
        type="submit" 
        className="submit-button"
        disabled={isUploading}
      >
        {isUploading ? 'Uploading...' : 'Upload Track'}
      </button>

      {error && (
        <p className="upload-error-message">
          {error}
        </p>
      )}

      {successMessage && (
        <p className="upload-success-message">
          {successMessage}
        </p>
      )}
    </form>
  );
};

export default UploadForm;

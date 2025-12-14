import { useState } from 'react';
import { TrackFormData } from '../types/track';
import '../index.css';

interface UploadFormProps {
  onUpload: (trackData: TrackFormData) => void;
}

const UploadForm: React.FC<UploadFormProps> = ({ onUpload }) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpload(formData);
    // Reset form
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
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
        >
          <option value="">Select Genre</option>
          <option value="Electronic">Electronic</option>
          <option value="Hip-Hop">Hip-Hop</option>
          <option value="Rock">Rock</option>
          <option value="Pop">Pop</option>
          <option value="Jazz">Jazz</option>
          <option value="Classical">Classical</option>
          <option value="Ambient">Ambient</option>
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
        />
      </div>

      <div className="form-group">
        <label htmlFor="audioUrl">Audio File URL</label>
        <input
          type="text"
          id="audioUrl"
          name="audioUrl"
          value={formData.audioUrl}
          onChange={handleChange}
          placeholder="https://..."
        />
      </div>

      <button type="submit" className="submit-button">
        Upload Track
      </button>
    </form>
  );
};

export default UploadForm;

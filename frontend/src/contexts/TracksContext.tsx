import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Track } from '../types/track';

interface TracksContextType {
  tracks: Track[];
  currentTrack: Track | null;
  setCurrentTrack: (track: Track | null) => void;
  addTrack: (track: Track) => void;
  getTrackById: (id: number) => Track | undefined;
}

const TracksContext = createContext<TracksContextType | undefined>(undefined);

export const TracksProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);

  // Ladda tracks från localStorage när komponenten mountas
  useEffect(() => {
    const mockTracks: Track[] = [
      {
        id: 1,
        title: "Novacane",
        artist: "Frank Ocean",
        album: "Channel Orange",
        genre: "R&B",
        royaltyWallet: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1",
        releaseDate: Date.now(),
        uploader: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1",
        exists: true,
        imageUrl: "../assets/track-1.png"
      },
      {
        id: 2,
        title: "Summertime Sadness",
        artist: "Lana Del Rey",
        album: "Born to Die",
        genre: "Pop",
        royaltyWallet: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1",
        releaseDate: Date.now(),
        uploader: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1",
        exists: true,
        imageUrl: "../assets/track-2.png"
      },
      {
        id: 3,
        title: "The City",
        artist: "The 1975",
        album: "The 1975",
        genre: "Indie Rock",
        royaltyWallet: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1",
        releaseDate: Date.now(),
        uploader: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1",
        exists: true,
        imageUrl: "../assets/track-3.png"
      }
    ];
    
    const storedTracks = localStorage.getItem('strictly_tracks');
    if (storedTracks) {
      // Om det finns sparade låtar, använd dem
      setTracks(JSON.parse(storedTracks));
    } else {
      // Annars använd mock-låtar
      setTracks(mockTracks);
      localStorage.setItem('strictly_tracks', JSON.stringify(mockTracks));
    }
  }, []);

  const addTrack = (track: Track) => {
    const updatedTracks = [...tracks, track];
    setTracks(updatedTracks);
    localStorage.setItem('strictly_tracks', JSON.stringify(updatedTracks));
  };

  const getTrackById = (id: number): Track | undefined => {
    return tracks.find(track => track.id === id);
  };

  return (
    <TracksContext.Provider value={{ tracks, currentTrack, setCurrentTrack, addTrack, getTrackById }}>
      {children}
    </TracksContext.Provider>
  );
};

export const useTracks = () => {
  const context = useContext(TracksContext);
  if (context === undefined) {
    throw new Error('useTracks must be used within a TracksProvider');
  }
  return context;
};

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Track } from '../types/track';
import { STRICTLY_CONTRACT_ADDRESS } from '../utils/contractConfig';

interface TracksContextType {
  tracks: Track[];
  currentTrack: Track | null;
  setCurrentTrack: (track: Track | null) => void;
  addTrack: (track: Track) => void;
  getTrackById: (id: number) => Track | undefined;
}

const TracksContext = createContext<TracksContextType | undefined>(undefined);

type StoredTracksPayload =
  | Track[]
  | {
      contractAddress: string;
      tracks: Track[];
    };

export const TracksProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);

  useEffect(() => {
    const storedTracks = localStorage.getItem('strictly_tracks');
    if (storedTracks) {
      try {
        const parsed: StoredTracksPayload = JSON.parse(storedTracks);

        // Äldre format (bara array) saknar contractAddress => rensa för att undvika id-mismatch efter redeploy.
        if (Array.isArray(parsed)) {
          localStorage.removeItem('strictly_tracks');
          setTracks([]);
          return;
        }

        // Nytt format: validera att vi är på samma kontrakt
        const storedAddress = (parsed.contractAddress || '').toLowerCase();
        const currentAddress = (STRICTLY_CONTRACT_ADDRESS || '').toLowerCase();

        if (storedAddress && currentAddress && storedAddress !== currentAddress) {
          localStorage.removeItem('strictly_tracks');
          setTracks([]);
          return;
        }

        setTracks(parsed.tracks || []);
      } catch {
        localStorage.removeItem('strictly_tracks');
        setTracks([]);
      }
    }
  }, []);

  const addTrack = (track: Track) => {
    const updatedTracks = [...tracks, track];
    setTracks(updatedTracks);
    localStorage.setItem(
      'strictly_tracks',
      JSON.stringify({
        contractAddress: STRICTLY_CONTRACT_ADDRESS,
        tracks: updatedTracks,
      })
    );
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

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

  useEffect(() => {
    const storedTracks = localStorage.getItem('strictly_tracks');
    if (storedTracks) {
      setTracks(JSON.parse(storedTracks));
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

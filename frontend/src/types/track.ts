export interface Track {
  id: number;
  title: string;
  artist: string;
  album: string;
  genre: string;
  royaltyWallet: string;
  releaseDate: number;
  uploader: string;
  exists: boolean;
  imageUrl?: string;
  audioUrl?: string;
}

export interface TrackFormData {
  title: string;
  artist: string;
  album: string;
  genre: string;
  royaltyWallet: string;
  releaseDate: number;
  imageUrl?: string;
  audioUrl?: string;
}

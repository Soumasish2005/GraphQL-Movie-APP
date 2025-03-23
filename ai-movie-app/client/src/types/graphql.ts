export interface Movie {
  id: string;
  name: string;
  description?: string;
  isInTheatres: boolean;
  directors: string[];
  releaseYear: number;
  genre: string[];
  rating: number;
  studio: string;
  runtime: number;
  thumbnail?: string;
  downloadLinks?: string[];
  watchLinks?: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  watchList?: Movie[];
  watchedMovies?: Movie[];
  downloadedMovies?: Movie[];
}

export interface Comment {
  id: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
  };
  replies?: Comment[];
}

export interface AuthResponse {
  token: string;
  user: User;
}
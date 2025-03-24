import React from 'react';
import { Star, Clock, Calendar, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MovieCardProps {
  id: string;
  title: string;
  posterUrl: string;
  rating: number;
  year: string;
  runtime?: number;
  genres?: string[];
  description?: string;
}

export const MovieCard = ({
  id,
  title,
  posterUrl,
  rating,
  year,
  runtime,
  genres,
  description
}: MovieCardProps) => {
  return (
    <Link to={`/movie/${id}`} className="block group">
      <div className="card group relative">
        <div className="relative aspect-[2/3] overflow-hidden rounded-t-2xl">
          <img
            src={posterUrl}
            alt={title}
            className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {genres && genres.length > 0 && (
            <div className="absolute top-3 left-3 flex flex-wrap gap-2">
              {genres.slice(0, 2).map((genre) => (
                <span
                  key={genre}
                  className="bg-blue-500/80 backdrop-blur-sm text-xs font-medium px-3 py-1 rounded-full
                           shadow-lg transform transition-transform duration-300 group-hover:scale-105"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}

          <button
            className="absolute top-3 right-3 p-2 rounded-full bg-gray-900/50 backdrop-blur-sm
                     border border-gray-700/50 opacity-0 group-hover:opacity-100
                     transform translate-y-2 group-hover:translate-y-0
                     transition-all duration-300 hover:bg-blue-500/20 hover:border-blue-500/50"
          >
            <Heart className="h-5 w-5 text-white" />
          </button>
        </div>
        
        <div className="p-5">
          <h3 className="text-lg font-semibold text-white truncate group-hover:text-blue-400 transition-colors duration-300">
            {title}
          </h3>
          
          {description && (
            <p className="mt-2 text-sm text-gray-400 overflow-hidden text-ellipsis display-webkit-box webkit-line-clamp-2 webkit-box-orient-vertical">
              {description}
            </p>
          )}
          
          <div className="mt-4 flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center text-yellow-400">
                <Star className="h-4 w-4 mr-1 fill-current" />
                <span className="font-medium">{rating}</span>
              </div>
              <div className="flex items-center text-gray-400">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{year}</span>
              </div>
            </div>
            
            {runtime && (
              <div className="flex items-center text-gray-400">
                <Clock className="h-4 w-4 mr-1" />
                <span>{runtime}m</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
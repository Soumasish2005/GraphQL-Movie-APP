import React from 'react';
import { Star, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MovieCardProps {
  id: string;
  title: string;
  posterUrl: string;
  rating: number;
  year: number;
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
  console.log({ id, title, posterUrl, rating, year, runtime, genres, description });
  return (
    <Link to={`/movie/${id}`} className="block perspective-1000">
      <div className="relative w-full aspect-[2/3] transition-transform duration-700 transform-style-3d hover:rotate-y-180">
        {/* Front Side */}
        <div className="absolute inset-0 w-full h-full backface-hidden">
          <div className="relative w-full h-full rounded-xl overflow-hidden bg-dark-800">
            <img
              src={posterUrl}
              alt={title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            
            {/* Overlay with Movie Info */}
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
              <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">
                {title}
              </h3>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center text-yellow-400">
                    <Star className="w-4 h-4 fill-current mr-1" />
                    <span>{rating}</span>
                  </div>
                  {runtime && (
                    <div className="flex items-center text-gray-300">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{runtime} min</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back Side */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
          <div className="w-full h-full rounded-xl bg-dark-800 p-6 flex flex-col">
            <h3 className="text-lg font-semibold text-white mb-3">{title}</h3>
            
            {description && (
              <p className="text-gray-300 text-sm flex-grow overflow-y-auto">
                {description}
              </p>
            )}
            
            {genres && genres.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <span
                    key={genre}
                    className="px-2 py-1 text-xs font-medium bg-primary-500/20 text-primary-400 rounded-full"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}
            
            <div className="mt-4 text-sm text-gray-400">
              Released: {year}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
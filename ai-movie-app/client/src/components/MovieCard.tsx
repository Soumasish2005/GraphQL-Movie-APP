import React from 'react';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MovieCardProps {
  id: string;
  name: string;
  thumbnail: string;
  rating: number;
  year: string;
  description: string;
}

export const MovieCard = ({ id, name, thumbnail, rating, year, description }: MovieCardProps) => {
  return (
    <Link to={`/movie/${id}`} className="group">
      <div className="relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105">
        <img
          src={thumbnail}
          alt={name}
          className="h-[400px] w-full object-cover"
          loading="lazy"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <h3 className="text-lg font-semibold text-white">{name}</h3>
          <p className="text-gray-400">{description}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-gray-300">{year}</span>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 mr-1" />
              <span className="text-sm text-white">{rating.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
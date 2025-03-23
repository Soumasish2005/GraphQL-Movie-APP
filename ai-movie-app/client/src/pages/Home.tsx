import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ALL_MOVIES } from '../graphql/queries';

const Home = () => {
  const { loading, error, data } = useQuery(GET_ALL_MOVIES);

  useEffect(() => {
    if (error) {
      console.error('Error fetching movies:', error);
    }
  }, [error]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.getAllMovies.map((movie) => (
        <div key={movie.id} className="bg-gray-800 p-4 rounded-lg">
          <img src={movie.thumbnail} alt={movie.name} className="w-full h-48 object-cover rounded-lg" />
          <h2 className="text-xl font-bold mt-2">{movie.name}</h2>
          <p className="text-gray-400">{movie.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Home;
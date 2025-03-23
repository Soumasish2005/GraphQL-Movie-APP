import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ALL_MOVIES } from '../graphql/queries';
import { MovieCard } from '../components/MovieCard';

const Home = () => {
  const { loading, error, data } = useQuery(GET_ALL_MOVIES);
  console.log(data);

  useEffect(() => {
    if (error) {
      console.error('Error fetching movies:', error);
    }
  }, [error]);

  if (loading) return <p>Loading...</p>;
  if (!data || !data.getAllMovies) return <p>No movies found.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.getAllMovies.map((movie) => (
        <div key={movie.id} className="bg-gray-800 p-4 rounded-lg">
          
          <MovieCard id={movie.id} name={movie.name} rating={movie.rating} year={movie.releaseYear} thumbnail={movie.thumbnail} description={movie.description} />
        </div>
      ))}
    </div>
  );
};

export default Home;
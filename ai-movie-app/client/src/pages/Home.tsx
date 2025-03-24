import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ALL_MOVIES } from '../graphql/queries';
import { MovieCard } from '../components/MovieCard';
import { Film, Loader2 } from 'lucide-react';

const Home = () => {
  const { loading, error, data } = useQuery(GET_ALL_MOVIES);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (loading) return;
    const timer = setTimeout(() => setIsInitialLoad(false), 300);
    return () => clearTimeout(timer);
  }, [loading]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <div className="text-red-500 mb-4 animate-float">
          <Film className="h-20 w-20 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-400 text-lg">
            We're having trouble loading the movies. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4 text-gradient">
            Discover Amazing Movies
          </h1>
          <p className="text-xl text-gray-400">
            Explore the latest and greatest in cinema
          </p>
        </header>

        {loading || isInitialLoad ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
            <p className="text-gray-400 text-lg">Loading amazing movies...</p>
          </div>
        ) : (
          <div className="movie-grid">
            {data.getAllMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                id={movie.id}
                title={movie.name}
                posterUrl={movie.thumbnail || 'https://via.placeholder.com/300x450'}
                rating={movie.rating}
                year={movie.releaseYear}
                runtime={movie.runtime}
                genres={movie.genre}
                description={movie.description}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
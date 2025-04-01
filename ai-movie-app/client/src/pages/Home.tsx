import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ALL_MOVIES } from '../graphql/queries';
import { HeroCarousel } from '../components/HeroCarousel';
import { Link } from 'react-router-dom';

const MovieRow = ({ title, movies, loading }) => (
  <div className="mb-8 sm:mb-12">
    <div className="flex items-center justify-between mb-4 sm:mb-6">
      <h2 className="text-xl sm:text-2xl font-bold">{title}</h2>
      <Link to="/movies" className="text-sm text-primary-400 hover:text-primary-500 transition-colors">
        View All
      </Link>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
      {loading ? (
        Array(6).fill(0).map((_, i) => (
          <div key={i} className="aspect-[2/3] rounded-xl bg-dark-800 animate-pulse" />
        ))
      ) : (
        movies?.map((movie) => (
          <Link 
            key={movie.id} 
            to={`/movie/${movie.id}`}
            className="group relative overflow-hidden rounded-xl"
          >
            <div className="aspect-[2/3] overflow-hidden rounded-xl">
              <img 
                src={movie.thumbnail} 
                alt={movie.title}
                className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-sm font-semibold text-white line-clamp-2">{movie.title}</h3>
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  </div>
);

const Home = () => {
  const { loading, error, data } = useQuery(GET_ALL_MOVIES);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [featuredMovies, setFeaturedMovies] = useState([]);

  useEffect(() => {
    if (loading) return;
    const timer = setTimeout(() => setIsInitialLoad(false), 300);
    return () => clearTimeout(timer);
  }, [loading]);

  useEffect(() => {
    if (data?.getAllMovies) {
      setFeaturedMovies(data.getAllMovies.slice(0, 5));
    }
  }, [data]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <h2 className="text-3xl font-bold mb-2">Something went wrong</h2>
        <p className="text-gray-400">Please try again later.</p>
      </div>
    );
  }

  const getMoviesByCategory = (start, end) => {
    return data?.getAllMovies.slice(start, end) || [];
  };

  return (
    <div className="min-h-screen w-full bg-dark-900">
      {/* Hero Section with top padding to account for navbar */}
      <div className="pt-16 sm:pt-20">
        {!loading && featuredMovies.length > 0 && (
          <HeroCarousel movies={featuredMovies} />
        )}
      </div>

      {/* Movie Sections */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <MovieRow 
          title="Trending Movies" 
          movies={getMoviesByCategory(0, 6)} 
          loading={loading} 
        />
        
        <MovieRow 
          title="Popular This Week" 
          movies={getMoviesByCategory(6, 12)} 
          loading={loading} 
        />
        
        <MovieRow 
          title="New Releases" 
          movies={getMoviesByCategory(12, 18)} 
          loading={loading} 
        />
        
        <MovieRow 
          title="Recommended for You" 
          movies={getMoviesByCategory(18, 24)} 
          loading={loading} 
        />
      </div>
    </div>
  );
};

export default Home;
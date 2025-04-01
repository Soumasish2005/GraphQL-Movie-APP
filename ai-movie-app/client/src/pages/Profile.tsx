import { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { Movie } from '../types/graphql';
import { GET_USER_PROFILE, GET_USER_WATCHLIST } from '../graphql/queries';
import { MovieCard } from '../components/MovieCard';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const Profile = () => {
  const navigate = useNavigate();
  const { signout } = useAuthStore();
  const userId = localStorage.getItem('userId'); // Assuming userId is stored in localStorage
  const { loading, error, data: userData } = useQuery(GET_USER_PROFILE, {
    variables: { id: userId?.toString() },
  });
  const { loading: watchListLoading, error: watchListError, data: watchlistData, refetch: refetchWatchlist } = useQuery(GET_USER_WATCHLIST, {
    variables: { userId },
  });

  useEffect(() => {
    if (error) {
      console.error('Error fetching user profile:', error);
    }
    if (watchListError) {
      console.error('Error fetching watchlist:', watchListError);
    }
    refetchWatchlist();
  }, [error, watchListError]);

  const handleLogout = () => {
    localStorage.removeItem('userId'); // Clear user data
    navigate('/login'); // Redirect to login page
  };

  if (loading || watchListLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || watchListError) {
    return (
      <div className="text-center text-red-500 mt-8">
        Error loading profile: {error?.message || watchListError?.message}
      </div>
    );
  }

  if (!userData || !userData.getUserById) {
    return (
      <div className="text-center text-red-500 mt-8">
        User profile not found.
      </div>
    );
  }

  const watchList = watchlistData?.getUserWatchList || [];

  return (
    <div className="relative px-4 sm:px-8 lg:px-16">
      {/* Logout Icon */}
      <div className="absolute top-4 right-4">
        <button
          onClick={handleLogout}
          className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white"
          title="Logout"
        >
          <LogOut className="w-6 h-6" />
        </button>
      </div>

      {/* Profile Content */}
      <div className="max-w-4xl mx-auto bg-gray-800 p-6 sm:p-8 mt-16 rounded-lg shadow-lg">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
          <img
            src="https://via.placeholder.com/150"
            alt="User Avatar"
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-primary-500"
          />
          <div className="text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">{userData.getUserById.name}</h2>
            <p className="text-gray-400">{userData.getUserById.email}</p>
          </div>
        </div>

        {/* Watchlist Section */}
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">Watch List</h3>
          {watchList.length === 0 ? (
            <p className="text-gray-400">Your watchlist is empty.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {watchList.map((movie: Movie) => (
                <MovieCard
                  key={movie.id}
                  id={movie.id}
                  title={movie.title}
                  posterUrl={movie.thumbnail || 'https://via.placeholder.com/300'}
                  rating={movie.rating}
                  year={movie.releaseYear}
                  runtime={movie.runtime}
                  genres={movie.genres}
                  description={movie.description}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
import { useEffect } from 'react';
import { useQuery } from '@apollo/client';
// import { MovieCard } from '../components/MovieCard';
// import { useAuthStore } from '../store/authStore';
import { Movie } from '../types/graphql';
import { GET_USER_PROFILE, GET_USER_WATCHLIST } from '../graphql/queries';
import { MovieCard } from '../components/MovieCard';



const Profile = () => {
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
    if(watchListError) {
      console.error('Error fetching watchlist:', watchListError);
    }
    refetchWatchlist();
  }, [error, watchListError]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-8">
        Error loading profile: {error.message}
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
    <div className="max-w-4xl mx-auto bg-gray-800 p-8 rounded-lg">
      <h2 className="text-3xl font-bold mb-4">Profile</h2>
      <p className="text-gray-400">Name: {userData.getUserById.name}</p>
      <p className="text-gray-400">Email: {userData.getUserById.email}</p>
      <div className="mt-8">
        <h3 className="text-2xl font-bold">Watch List</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {watchList.map((movie: Movie) => (
            // <div key={movie.id} className="bg-gray-700 p-4 rounded-lg">
            //   <img
            //     src={movie.thumbnail}
            //     alt={movie.title}
            //     className="w-full h-48 object-cover rounded-lg"
            //   />
            //   <h4 className="text-xl font-bold mt-2">{movie.title}</h4>
            //   <p className="text-gray-400">Rating: {movie.rating}</p>
            // </div>
            <MovieCard key={movie.id} id={movie.id} posterUrl={movie.thumbnail || ''} title={movie.title} rating={movie.rating} year={'2022'}/>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
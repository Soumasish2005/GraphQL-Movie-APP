import React, { useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import { MovieCard } from '../components/MovieCard';
import { useAuthStore } from '../store/authStore';

const GET_USER_PROFILE = gql`
  query GetUserProfile($id: ID!) {
    getUserById(id: $id) {
      id
      name
      email
      watchList {
        id
        name
        thumbnail
        rating
      }
    }
  }
`;

const Profile = () => {
  const userId = localStorage.getItem('userId'); // Assuming userId is stored in localStorage
  console.log('userId:', userId);
  const { loading, error, data } = useQuery(GET_USER_PROFILE, {
    variables: { id: userId },
  });
  console.log('data:', data);

  useEffect(() => {
    if (error) {
      console.error('Error fetching user profile:', error);
    }
  }, [error]);

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

  if (!data || !data.getUserById) {
    return (
      <div className="text-center text-red-500 mt-8">
        User profile not found.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-gray-800 p-8 rounded-lg">
      <h2 className="text-3xl font-bold mb-4">Profile</h2>
      <p className="text-gray-400">Name: {data.getUserById.name}</p>
      <p className="text-gray-400">Email: {data.getUserById.email}</p>
      <div className="mt-8">
        <h3 className="text-2xl font-bold">Watch List</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.getUserById.watchList.map((movie) => (
            <div key={movie.id} className="bg-gray-700 p-4 rounded-lg">
              <img src={movie.thumbnail} alt={movie.name} className="w-full h-48 object-cover rounded-lg" />
              <h4 className="text-xl font-bold mt-2">{movie.name}</h4>
              <p className="text-gray-400">{movie.rating}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
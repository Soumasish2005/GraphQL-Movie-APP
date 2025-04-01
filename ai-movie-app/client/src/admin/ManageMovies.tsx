import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';
import { GET_ALL_MOVIES } from '../graphql/queries';
import { DELETE_MOVIE, ADD_MOVIE, UPDATE_MOVIE } from '../graphql/mutations';

function ManageMovies() {
  const { data, loading, error } = useQuery(GET_ALL_MOVIES);
  const [deleteMovie] = useMutation(DELETE_MOVIE);
  const [addMovie] = useMutation(ADD_MOVIE);
  const [updateMovie] = useMutation(UPDATE_MOVIE);

  const [newMovie, setNewMovie] = useState({ title: '', releaseYear: '', rating: '' });

  const handleDelete = async (id: string) => {
    await deleteMovie({ variables: { id } });
    window.location.reload();
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading movies</div>;

  return (
    <div className="p-5 font-sans">
      <h2 className="text-center text-2xl font-bold mb-5">Manage Movies</h2>
      <div className="mb-5 text-right">
        <Link
          to="add"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add New Movie
        </Link>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Title</th>
            <th className="border border-gray-300 px-4 py-2">Release Year</th>
            <th className="border border-gray-300 px-4 py-2">Rating</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.getAllMovies.map((movie: any) => (
            <tr key={movie.id}>
              <td className="border border-gray-300 px-4 py-2">{movie.title}</td>
              <td className="border border-gray-300 px-4 py-2">{movie.releaseYear}</td>
              <td className="border border-gray-300 px-4 py-2">{movie.rating}</td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  onClick={() => handleDelete(movie.id)}
                  className="mr-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
                <Link
                  to={`update/${movie.id}`}
                  className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Update
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageMovies;
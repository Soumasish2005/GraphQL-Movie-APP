import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { UPDATE_MOVIE } from '../graphql/mutations';
import { GET_MOVIE_DETAIL } from '../graphql/queries';
import { useParams, useNavigate } from 'react-router-dom';

function UpdateMovie() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, loading, error } = useQuery(GET_MOVIE_DETAIL, { variables: { id } });
  const [updateMovie] = useMutation(UPDATE_MOVIE);

  const [movie, setMovie] = useState({
    title: '',
    description: '',
    isInTheatres: false,
    directors: [],
    actors: [],
    languages: [],
    releaseYear: '',
    genres: [],
    rating: '',
    studio: '',
    runtime: '',
    thumbnail: '',
    downloadLinks: [],
    watchLinks: [],
    trailer: '',
  });

  useEffect(() => {
    if (data) {
      setMovie({
        ...data.getMovieById,
        directors: data.getMovieById.directors || [],
        actors: data.getMovieById.actors || [],
        languages: data.getMovieById.languages || [],
        genres: data.getMovieById.genres || [],
        downloadLinks: data.getMovieById.downloadLinks || [],
        watchLinks: data.getMovieById.watchLinks || [],
      });
    }
  }, [data]);

  const handleUpdateMovie = async () => {
    if (!movie.title || !movie.releaseYear || !movie.rating) {
      alert('Please fill in all required fields');
      return;
    }

    const { __typename, id: movieId, ...sanitizedMovie } = movie; // Exclude __typename and id

    try {
      await updateMovie({ variables: { id, input: sanitizedMovie } });
      alert('Movie updated successfully!');
      navigate('/admin/movies');
    } catch (error) {
      console.error('Error updating movie:', error);
      alert('Failed to update movie. Please check the console for details.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading movie details</div>;

  return (
    <div className="p-8 max-w-3xl mx-auto bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold text-center mb-6">Update Movie</h2>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={movie.title}
          onChange={(e) => setMovie({ ...movie, title: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md bg-black text-white"
        />
        <textarea
          placeholder="Description"
          value={movie.description}
          onChange={(e) => setMovie({ ...movie, description: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md bg-black text-white"
        />
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={movie.isInTheatres}
            onChange={(e) => setMovie({ ...movie, isInTheatres: e.target.checked })}
            className="h-4 w-4"
          />
          <span>In Theatres</span>
        </label>
        <input
          type="text"
          placeholder="Directors (comma-separated)"
          value={movie.directors.join(', ')}
          onChange={(e) => setMovie({ ...movie, directors: e.target.value.split(',').map(d => d.trim()) })}
          className="w-full p-2 border border-gray-300 rounded-md bg-black text-white"
        />
        <input
          type="text"
          placeholder="Actors (comma-separated)"
          value={movie.actors.join(', ')}
          onChange={(e) => setMovie({ ...movie, actors: e.target.value.split(',').map(a => a.trim()) })}
          className="w-full p-2 border border-gray-300 rounded-md bg-black text-white"
        />
        <input
          type="text"
          placeholder="Languages (comma-separated)"
          value={movie.languages.join(', ')}
          onChange={(e) => setMovie({ ...movie, languages: e.target.value.split(',').map(l => l.trim()) })}
          className="w-full p-2 border border-gray-300 rounded-md bg-black text-white"
        />
        <input
          type="text"
          placeholder="Release Year"
          value={movie.releaseYear}
          onChange={(e) => setMovie({ ...movie, releaseYear: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md bg-black text-white"
        />
        <input
          type="text"
          placeholder="Genres (comma-separated)"
          value={movie.genres.join(', ')}
          onChange={(e) => setMovie({ ...movie, genres: e.target.value.split(',').map(g => g.trim()) })}
          className="w-full p-2 border border-gray-300 rounded-md bg-black text-white"
        />
        <input
          type="text"
          placeholder="Rating"
          value={movie.rating}
          onChange={(e) => setMovie({ ...movie, rating: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md bg-black text-white"
        />
        <input
          type="text"
          placeholder="Studio"
          value={movie.studio}
          onChange={(e) => setMovie({ ...movie, studio: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md bg-black text-white"
        />
        <input
          type="text"
          placeholder="Runtime (minutes)"
          value={movie.runtime}
          onChange={(e) => setMovie({ ...movie, runtime: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md bg-black text-white"
        />
        <input
          type="text"
          placeholder="Thumbnail URL"
          value={movie.thumbnail}
          onChange={(e) => setMovie({ ...movie, thumbnail: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md bg-black text-white"
        />
        <input
          type="text"
          placeholder="Download Links (comma-separated)"
          value={movie.downloadLinks.join(', ')}
          onChange={(e) => setMovie({ ...movie, downloadLinks: e.target.value.split(',').map(d => d.trim()) })}
          className="w-full p-2 border border-gray-300 rounded-md bg-black text-white"
        />
        <input
          type="text"
          placeholder="Watch Links (comma-separated)"
          value={movie.watchLinks.join(', ')}
          onChange={(e) => setMovie({ ...movie, watchLinks: e.target.value.split(',').map(w => w.trim()) })}
          className="w-full p-2 border border-gray-300 rounded-md bg-black text-white"
        />
        <input
          type="text"
          placeholder="Trailer URL"
          value={movie.trailer}
          onChange={(e) => setMovie({ ...movie, trailer: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md bg-black text-white"
        />
        <button
          onClick={handleUpdateMovie}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
        >
          Update Movie
        </button>
      </div>
    </div>
  );
}

export default UpdateMovie;

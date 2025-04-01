import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_MOVIE } from '../graphql/mutations';
import { NavLink } from 'react-router-dom';

function AddMovie() {
  const [addMovie] = useMutation(ADD_MOVIE);
  const [newMovie, setNewMovie] = useState({
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

  const handleAddMovie = async () => {
    if (!newMovie.title || !newMovie.releaseYear || !newMovie.rating) {
      alert('Please fill in all required fields');
      return;
    }
  
    // Sanitize the input
    const sanitizedMovie = {
      ...newMovie,
      releaseYear: parseInt(newMovie.releaseYear),
      rating: parseFloat(newMovie.rating),
      runtime: parseInt(newMovie.runtime),
      directors: newMovie.directors.length > 0 ? newMovie.directors : null,
      actors: newMovie.actors.length > 0 ? newMovie.actors : null,
      languages: newMovie.languages.length > 0 ? newMovie.languages : null,
      genres: newMovie.genres.length > 0 ? newMovie.genres : null,
      downloadLinks: newMovie.downloadLinks.length > 0 ? newMovie.downloadLinks : null,
      watchLinks: newMovie.watchLinks.length > 0 ? newMovie.watchLinks : null,
    };
  
    console.log('Payload being sent:', sanitizedMovie);
  
    try {
      await addMovie({ variables: { input: sanitizedMovie } });
      alert('Movie added successfully!');
      setNewMovie({
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
      window.location.reload();
    } catch (error) {
      console.error('Error from server:', error);
      alert('Failed to add movie. Please check the console for details.');
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold text-center mb-6">Add New Movie</h2>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={newMovie.title}
          onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md bg-black text-white"
        />
        <textarea
          placeholder="Description"
          value={newMovie.description}
          onChange={(e) => setNewMovie({ ...newMovie, description: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md bg-black text-white"
        />
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={newMovie.isInTheatres}
            onChange={(e) => setNewMovie({ ...newMovie, isInTheatres: e.target.checked })}
            className="h-4 w-4"
          />
          <span>In Theatres</span>
        </label>
        <input
          type="text"
          placeholder="Directors (comma-separated)"
          value={newMovie.directors.join(', ')}
          onChange={(e) => setNewMovie({ ...newMovie, directors: e.target.value.split(',').map(d => d.trim()) })}
          className="w-full p-2 border border-gray-300 rounded-md bg-black text-white"
        />
        <input
          type="text"
          placeholder="Actors (comma-separated)"
          value={newMovie.actors.join(', ')}
          onChange={(e) => setNewMovie({ ...newMovie, actors: e.target.value.split(',').map(a => a.trim()) })}
          className="w-full p-2 border border-gray-300 rounded-md bg-black text-white"
        />
        <input
          type="text"
          placeholder="Languages (comma-separated)"
          value={newMovie.languages.join(', ')}
          onChange={(e) => setNewMovie({ ...newMovie, languages: e.target.value.split(',').map(l => l.trim()) })}
          className="w-full p-2 border border-gray-300 rounded-md bg-black text-white"
        />
        <input
          type="text"
          placeholder="Release Year"
          value={newMovie.releaseYear}
          onChange={(e) => setNewMovie({ ...newMovie, releaseYear: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md bg-black text-white"
        />
        <input
          type="text"
          placeholder="Genres (comma-separated)"
          value={newMovie.genres.join(', ')}
          onChange={(e) => setNewMovie({ ...newMovie, genres: e.target.value.split(',').map(g => g.trim()) })}
          className="w-full p-2 border border-gray-300 rounded-md bg-black text-white"
        />
        <input
          type="text"
          placeholder="Rating"
          value={newMovie.rating}
          onChange={(e) => setNewMovie({ ...newMovie, rating: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md bg-black text-white"
        />
        <input
          type="text"
          placeholder="Studio"
          value={newMovie.studio}
          onChange={(e) => setNewMovie({ ...newMovie, studio: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md bg-black text-white"
        />
        <input
          type="text"
          placeholder="Runtime (minutes)"
          value={newMovie.runtime}
          onChange={(e) => setNewMovie({ ...newMovie, runtime: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md bg-black text-white"
        />
        <input
          type="text"
          placeholder="Thumbnail URL"
          value={newMovie.thumbnail}
          onChange={(e) => setNewMovie({ ...newMovie, thumbnail: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md bg-black text-white"
        />
        <input
          type="text"
          placeholder="Download Links (comma-separated)"
          value={newMovie.downloadLinks.join(', ')}
          onChange={(e) => setNewMovie({ ...newMovie, downloadLinks: e.target.value.split(',').map(d => d.trim()) })}
          className="w-full p-2 border border-gray-300 rounded-md bg-black text-white"
        />
        <input
          type="text"
          placeholder="Watch Links (comma-separated)"
          value={newMovie.watchLinks.join(', ')}
          onChange={(e) => setNewMovie({ ...newMovie, watchLinks: e.target.value.split(',').map(w => w.trim()) })}
          className="w-full p-2 border border-gray-300 rounded-md bg-black text-white"
        />
        <input
          type="text"
          placeholder="Trailer URL"
          value={newMovie.trailer}
          onChange={(e) => setNewMovie({ ...newMovie, trailer: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md bg-black text-white"
        />
        <button
          onClick={handleAddMovie}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
        >
          Add Movie
        </button>
      </div>
    </div>
  );
}

export default AddMovie;

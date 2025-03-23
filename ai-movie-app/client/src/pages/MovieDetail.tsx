import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import { Star, Clock, Calendar, Heart } from 'lucide-react';

const GET_MOVIE_DETAIL = gql`
  query GetMovieDetail($id: ID!) {
    getMovieById(id: $id) {
      id
      name
      description
      thumbnail
      rating
      releaseYear
      runtime
      genre
    }
  }
`;

const GET_MOVIE_COMMENTS = gql`
  query GetMovieComments($movieId: ID!) {
    getCommentsByMovieId(movieId: $movieId) {
      id
      text
      user {
        name
      }
      replies {
        id
        text
        user {
          name
        }
      }
    }
  }
`;

const MovieDetail = () => {
  const { id } = useParams();
  const { loading: movieLoading, error: movieError, data: movieData } = useQuery(GET_MOVIE_DETAIL, {
    variables: { id },
  });
  const { loading: commentsLoading, error: commentsError, data: commentsData } = useQuery(GET_MOVIE_COMMENTS, {
    variables: { movieId: id },
  });

  useEffect(() => {
    if (movieError) {
      console.error('Error fetching movie details:', movieError);
    }
    if (commentsError) {
      console.error('Error fetching comments:', commentsError);
    }
  }, [movieError, commentsError]);

  if (movieLoading || commentsLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const movie = movieData?.getMovieById;
  const comments = commentsData?.getCommentsByMovieId;

  if (!movie) {
    return (
      <div className="text-center text-red-500 mt-8">
        Error loading movie details.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3">
          <img
            src={movie.thumbnail}
            alt={movie.name}
            className="w-full rounded-lg shadow-lg"
          />
        </div>
        <div className="w-full md:w-2/3">
          <h1 className="text-4xl font-bold text-white mb-4">{movie.name}</h1>
          
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center text-yellow-400">
              <Star className="h-5 w-5 mr-1" />
              <span>{movie.rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center text-gray-300">
              <Clock className="h-5 w-5 mr-1" />
              <span>{movie.runtime} min</span>
            </div>
            <div className="flex items-center text-gray-300">
              <Calendar className="h-5 w-5 mr-1" />
              <span>{movie.releaseYear}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {movie.genre.map((genre: string) => (
              <span
                key={genre}
                className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm"
              >
                {genre}
              </span>
            ))}
          </div>

          <p className="text-gray-300 mb-6">{movie.description}</p>

          <button className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors">
            <Heart className="h-5 w-5" />
            Add to Watchlist
          </button>
        </div>
      </div>
      <div className="mt-8">
        <h3 className="text-2xl font-bold">Comments</h3>
        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-700 p-4 rounded-lg mt-4">
            <p className="text-gray-300">{comment.text}</p>
            <p className="text-gray-500 text-sm">- {comment.user.name}</p>
            {comment.replies.map((reply) => (
              <div key={reply.id} className="bg-gray-600 p-3 rounded-lg mt-2 ml-4">
                <p className="text-gray-300">{reply.text}</p>
                <p className="text-gray-500 text-sm">- {reply.user.name}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieDetail;
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Star, Clock, Calendar, Heart, Film, MessageCircle, Loader2, Share2 } from 'lucide-react';
import { GET_MOVIE_DETAIL, GET_MOVIE_COMMENTS } from '../graphql/queries';

const MovieDetail = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  
  const { loading: movieLoading, error: movieError, data: movieData } = useQuery(GET_MOVIE_DETAIL, {
    variables: { id },
  });
  
  const { loading: commentsLoading, error: commentsError, data: commentsData } = useQuery(GET_MOVIE_COMMENTS, {
    variables: { movieId: id },
  });

  useEffect(() => {
    if (!movieLoading && !commentsLoading) {
      const timer = setTimeout(() => setIsLoading(false), 300);
      return () => clearTimeout(timer);
    }
  }, [movieLoading, commentsLoading]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (movieError || commentsError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <div className="text-red-500 mb-4">
          <Film className="h-20 w-20 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-400 text-lg">
            We're having trouble loading the movie details. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const movie = movieData?.getMovieById;
  const comments = commentsData?.getCommentsByMovieId || [];

  if (!movie) {
    return (
      <div className="text-center text-red-500 mt-8">
        Movie not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-12">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />
        <div 
          className="rounded-md w-full h-[60vh] bg-cover bg-center"
          style={{ backgroundImage: `url(${movie.thumbnail})` }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-44 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Movie Poster */}
          <div className="lg:w-1/3">
            <div className="card overflow-hidden">
              <img
                src={movie.thumbnail}
                alt={movie.name}
                className="w-full h-auto rounded-2xl"
              />
            </div>
          </div>

          {/* Movie Details */}
          <div className="lg:w-2/3">
            <div className="card p-8">
              <h1 className="text-4xl font-bold mb-4">{movie.name}</h1>
              
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center text-yellow-400">
                  <Star className="h-5 w-5 mr-1 fill-current" />
                  <span className="font-semibold">{movie.rating}</span>
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
                {movie.genre && movie.genre.map((g: string) => (
                  <span
                    key={g}
                    className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium"
                  >
                    {g}
                  </span>
                ))}
              </div>

              <p className="text-gray-300 text-lg leading-relaxed mb-8">
                {movie.description}
              </p>

              <div className="flex flex-wrap gap-4">
                <button className="btn-primary flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Add to Watchlist
                </button>
                <button className="btn-secondary flex items-center gap-2">
                  <Share2 className="h-5 w-5" />
                  Share
                </button>
              </div>
            </div>

            {/* Comments Section */}
            <div className="card mt-8 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <MessageCircle className="h-6 w-6" />
                  Comments
                </h2>
                <span className="text-gray-400">{comments.length} comments</span>
              </div>

              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="glass-effect rounded-xl p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <span className="text-blue-400 font-semibold">
                            {comment.user.name[0].toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium">{comment.user.name}</span>
                      </div>
                    </div>
                    <p className="text-gray-300">{comment.text}</p>

                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-4 ml-8 space-y-4">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="glass-effect rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center">
                                <span className="text-sm">
                                  {reply.user.name[0].toUpperCase()}
                                </span>
                              </div>
                              <span className="font-medium text-sm">{reply.user.name}</span>
                            </div>
                            <p className="text-gray-400 text-sm">{reply.text}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
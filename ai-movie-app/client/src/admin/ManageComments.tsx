import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_MOVIE_COMMENTS } from '../graphql/queries';
import { DELETE_COMMENT } from '../graphql/mutations';

function ManageComments() {
  const { data, loading, error } = useQuery(GET_MOVIE_COMMENTS, {
    variables: { movieId: '1' }, // Replace with dynamic movie ID
  });
  const [deleteComment] = useMutation(DELETE_COMMENT);

  const handleDelete = async (id: string) => {
    await deleteComment({ variables: { id } });
    window.location.reload();
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading comments</div>;

  return (
    <div>
      <h2>Manage Comments</h2>
      <ul>
        {data.getCommentsByMovieId.map((comment: any) => (
          <li key={comment.id}>
            {comment.text} - {comment.user.name}
            <button onClick={() => handleDelete(comment.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ManageComments;
import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { UPDATE_USER } from '../graphql/mutations';
import { GET_USER_BY_ID } from '../graphql/queries';
import { useParams, useNavigate } from 'react-router-dom';

function UpdateUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, loading, error } = useQuery(GET_USER_BY_ID, { variables: { id } });
  const [updateUser] = useMutation(UPDATE_USER);

  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'REGULAR',
  });

  useEffect(() => {
    if (data) {
      setUser({
        ...data.getUserById,
        password: '', // Do not prefill the password
      });
    }
  }, [data]);

  const handleUpdateUser = async () => {
    if (!user.name || !user.email) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await updateUser({ variables: { id, input: user } });
      alert('User updated successfully!');
      navigate('/admin/users');
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user. Please check the console for details.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading user details</div>;

  return (
    <div className="p-8 max-w-3xl mx-auto bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold text-center mb-6">Update User</h2>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={user.name}
          onChange={(e) => setUser({ ...user, name: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <input
          type="email"
          placeholder="Email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <input
          type="password"
          placeholder="New Password (optional)"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <select
          value={user.role}
          onChange={(e) => setUser({ ...user, role: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="REGULAR">Regular</option>
          <option value="ADMIN">Admin</option>
        </select>
        <button
          onClick={handleUpdateUser}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
        >
          Update User
        </button>
      </div>
    </div>
  );
}

export default UpdateUser;

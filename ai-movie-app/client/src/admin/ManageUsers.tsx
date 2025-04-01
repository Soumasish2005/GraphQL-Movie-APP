import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';
import { GET_ALL_USERS } from '../graphql/queries';
import { DELETE_USER } from '../graphql/mutations';
import { User } from '../types/graphql';

function ManageUsers() {
  const { data, loading, error } = useQuery(GET_ALL_USERS);
  const [deleteUser] = useMutation(DELETE_USER);

  const handleDelete = async (id: string) => {
    await deleteUser({ variables: { id } });
    window.location.reload();
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading users</div>;

  return (
    <div className="p-5 font-sans">
      <h2 className="text-center text-2xl font-bold mb-5">Manage Users</h2>
      <div className="mb-5 text-right">
        <Link
          to="add"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add New User
        </Link>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">Role</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.getAllUsers.map((user: User) => (
            <tr key={user.id}>
              <td className="border border-gray-300 px-4 py-2">{user.name}</td>
              <td className="border border-gray-300 px-4 py-2">{user.email}</td>
              <td className="border border-gray-300 px-4 py-2">{user.role}</td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  onClick={() => handleDelete(user.id)}
                  className="mr-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
                <Link
                  to={`update/${user.id}`}
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

export default ManageUsers;
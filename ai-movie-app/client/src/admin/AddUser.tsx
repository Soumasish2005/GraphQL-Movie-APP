import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { REGISTER_USER } from '../graphql/mutations';
import { useNavigate } from 'react-router-dom';

function AddUser() {
  const [registerUser] = useMutation(REGISTER_USER);
  const navigate = useNavigate();
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'REGULAR',
  });

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await registerUser({ variables: { input: newUser } });
      alert('User added successfully!');
      navigate('/admin/users');
    } catch (error) {
      console.error('Error adding user:', error);
      alert('Failed to add user. Please check the console for details.');
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold text-center mb-6">Add New User</h2>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <input
          type="password"
          placeholder="Password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <select
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="REGULAR">Regular</option>
          <option value="ADMIN">Admin</option>
        </select>
        <button
          onClick={handleAddUser}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
        >
          Add User
        </button>
      </div>
    </div>
  );
}

export default AddUser;

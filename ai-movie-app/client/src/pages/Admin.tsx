import React, { Suspense, useState } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import ManageUsers from '../admin/ManageUsers';
import ManageMovies from '../admin/ManageMovies';
import ManageComments from '../admin/ManageComments';
import AddMovie from '../admin/AddMovie';
import UpdateMovie from '../admin/UpdateMovie';
import AddUser from '../admin/AddUser';
import UpdateUser from '../admin/UpdateUser';

function Admin() {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div className="flex flex-col min-h-screen bg-dark-900 text-white mt-20">
      <nav className="bg-dark-800 shadow-md">
        <ul className="flex justify-center space-x-6 py-4">
          <li>
            <NavLink
              to="users"
              onClick={() => setActiveTab('users')}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg transition-all ${
                  isActive ? 'bg-primary-500 text-white' : 'hover:bg-dark-700'
                }`
              }
            >
              Manage Users
            </NavLink>
          </li>
          <li>
            <NavLink
              to="movies"
              onClick={() => setActiveTab('movies')}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg transition-all ${
                  isActive ? 'bg-primary-500 text-white' : 'hover:bg-dark-700'
                }`
              }
            >
              Manage Movies
            </NavLink>
          </li>
          <li>
            <NavLink
              to="comments"
              onClick={() => setActiveTab('comments')}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg transition-all ${
                  isActive ? 'bg-primary-500 text-white' : 'hover:bg-dark-700'
                }`
              }
            >
              Manage Comments
            </NavLink>
          </li>
        </ul>
      </nav>
      <main className="flex-grow p-6">
        <Suspense fallback={<div className="text-center">Loading...</div>}>
          <Routes>
            <Route path="users" element={<ManageUsers />} />
            <Route path="users/add" element={<AddUser />} />
            <Route path="users/update/:id" element={<UpdateUser />} />
            <Route path="movies" element={<ManageMovies />} />
            <Route path="movies/add" element={<AddMovie />} />
            <Route path="movies/update/:id" element={<UpdateMovie />} />
            <Route path="comments" element={<ManageComments />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

export default Admin;
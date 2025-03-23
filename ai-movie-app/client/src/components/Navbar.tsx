import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, Film, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export const Navbar = () => {
  const { token, logout } = useAuthStore();
  const [searchQuery, setSearchQuery] = React.useState('');
  const navigate = useNavigate();
  const signout = useAuthStore((state) => state.signout);

  const handleSignout = () => {
    signout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Film className="h-8 w-8" />
              <span className="text-xl font-bold">MovieVerse</span>
            </Link>
          </div>

          <div className="flex-1 max-w-xl mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search movies..."
                className="w-full bg-gray-800 text-white rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {token ? (
              <>
                <Link to="/profile" className="hover:text-blue-400">
                  <User className="h-6 w-6" />
                </Link>
                <button
                  onClick={handleSignout}
                  className="hover:text-blue-400"
                  aria-label="Logout"
                >
                  <LogOut className="h-6 w-6" />
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-full"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
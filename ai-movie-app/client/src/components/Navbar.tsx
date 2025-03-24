import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, User, Film, LogOut, Menu, X, Heart } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export const Navbar = () => {
  const { token, signout } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignout = () => {
    signout();
    navigate('/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-800'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center space-x-3 group"
            >
              <div className="relative">
                <Film className="h-9 w-9 text-blue-500 transform transition-transform duration-300 group-hover:scale-110" />
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl transition-opacity duration-300 opacity-0 group-hover:opacity-100" />
              </div>
              <span className="text-2xl font-bold text-gradient">
                MovieVerse
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:flex-1 md:justify-center md:px-8">
            <form onSubmit={handleSearch} className="w-full max-w-2xl">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Search movies..."
                  className="input-field pl-11 pr-4 py-3 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 transition-colors duration-300 group-focus-within:text-blue-500" />
              </div>
            </form>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-5">
            {token ? (
              <>
                <Link
                  to="/watchlist"
                  className="p-2 rounded-xl hover:bg-gray-800/50 transition-colors duration-300 relative group"
                >
                  <Heart className="h-6 w-6 text-gray-300 group-hover:text-blue-400 transition-colors duration-300" />
                </Link>
                <Link
                  to="/profile"
                  className="p-2 rounded-xl hover:bg-gray-800/50 transition-colors duration-300 relative group"
                >
                  <User className="h-6 w-6 text-gray-300 group-hover:text-blue-400 transition-colors duration-300" />
                </Link>
                <button
                  onClick={handleSignout}
                  className="p-2 rounded-xl hover:bg-gray-800/50 transition-colors duration-300 relative group"
                  aria-label="Logout"
                >
                  <LogOut className="h-6 w-6 text-gray-300 group-hover:text-red-400 transition-colors duration-300" />
                </button>
              </>
            ) : (
              <Link to="/login" className="btn-primary">
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-xl hover:bg-gray-800/50 transition-colors duration-300"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden glass-effect border-t border-gray-800">
          <div className="px-4 pt-2 pb-3 space-y-3">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Search movies..."
                  className="input-field pl-11"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 transition-colors duration-300 group-focus-within:text-blue-500" />
              </div>
            </form>
            
            {token ? (
              <>
                <Link
                  to="/watchlist"
                  className="flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-gray-700/50 transition-colors duration-300"
                >
                  <Heart className="h-5 w-5" />
                  <span>Watchlist</span>
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-gray-700/50 transition-colors duration-300"
                >
                  <User className="h-5 w-5" />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={handleSignout}
                  className="flex items-center space-x-3 w-full text-left px-3 py-2 rounded-xl hover:bg-gray-700/50 transition-colors duration-300 text-red-400"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="btn-primary w-full flex justify-center"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
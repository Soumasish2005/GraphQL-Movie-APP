import { useState } from 'react';
import { Link} from 'react-router-dom';
import { Search, Bell, Menu, X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export const Navbar = () => {
  const { token} = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-dark-900/90 to-transparent backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Desktop Navigation */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-2xl font-bold text-white hover:text-primary-400 transition-colors">
              MovieVerse
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link to="/" className="text-white hover:text-primary-400 transition-colors">Home</Link>
              <Link to="/movies" className="text-white hover:text-primary-400 transition-colors">Movies</Link>
              <Link to="/series" className="text-white hover:text-primary-400 transition-colors">Series</Link>
              <Link to="/kids" className="text-white hover:text-primary-400 transition-colors">Kids</Link>
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-6">
            <button className="text-white hover:text-primary-400 transition-colors">
              <Search className="w-6 h-6" />
            </button>
            <button className="text-white hover:text-primary-400 transition-colors">
              <Bell className="w-6 h-6" />
            </button>
            {token ? (
              <Link to="/profile">
                <img 
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces" 
                  alt="Profile" 
                  className="w-10 h-10 rounded-full border-2 border-primary-500 hover:border-primary-400 transition-colors"
                />
              </Link>
            ) : (
              <Link 
                to="/login" 
                className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <button className="text-white hover:text-primary-400 transition-colors">
              <Search className="w-6 h-6" />
            </button>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-primary-400 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-dark-900/95 backdrop-blur-sm border-t border-white/10">
            <div className="container mx-auto px-4 py-4 space-y-4">
              <Link 
                to="/" 
                className="block text-white hover:text-primary-400 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/movies" 
                className="block text-white hover:text-primary-400 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Movies
              </Link>
              <Link 
                to="/series" 
                className="block text-white hover:text-primary-400 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Series
              </Link>
              <Link 
                to="/kids" 
                className="block text-white hover:text-primary-400 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Kids
              </Link>
              <div className="pt-4 border-t border-white/10">
                {token ? (
                  <Link 
                    to="/profile" 
                    className="flex items-center space-x-3"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <img 
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces" 
                      alt="Profile" 
                      className="w-10 h-10 rounded-full border-2 border-primary-500"
                    />
                    <span className="text-white">My Profile</span>
                  </Link>
                ) : (
                  <Link 
                    to="/login" 
                    className="block bg-primary-500 hover:bg-primary-600 text-white text-center px-4 py-2 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
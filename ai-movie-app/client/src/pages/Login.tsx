import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate, Link } from 'react-router-dom';
import { LOGIN_USER } from '../graphql/mutations';
import { useAuthStore } from '../store/authStore';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, { loading, error }] = useMutation(LOGIN_USER);
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login({ variables: { email, password } });
      setToken(data.login.token);
      setUser(data.login.user);
      localStorage.setItem('userId', data.login.user.id); // Ensure userId is saved
      navigate('/');
    } catch (err) {
      console.error('Error logging in:', err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-dark-900 to-dark-800 px-4" >
      <div className="w-full max-w-md bg-dark-800 rounded-lg p-8 border-blue-500/50 border-2 shadow-[0px_0px_75px_0px_rgba(3,_105,_206,_0.41)]">
        <h2 className="text-3xl font-bold text-center text-white mb-6">Login to MovieVerse</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <p className="text-red-500 text-center">{error.message}</p>}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full p-2 rounded-md bg-dark-700 border outline-none border-gray-600 text-white shadow-sm focus:bg-dark-700 focus:border-2 focus:border-primary-500 focus:ring-primary-500 autofill:bg-dark-700 autofill:text-white autofill-focus:border-primary-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full p-2 rounded-md bg-dark-700 border border-gray-600 shadow-sm outline-none focus:bg-dark-700 focus:border-2 focus:border-primary-500 focus:ring-primary-500 autofill:bg-dark-700 autofill:text-white autofill-focus:border-primary-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-400 hover:text-primary-500">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
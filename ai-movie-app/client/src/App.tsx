import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { client } from './lib/apollo';
import { Navbar } from './components/Navbar';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

// Lazy load pages for better performance
const Home = React.lazy(() => import('./pages/Home'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const MovieDetail = React.lazy(() => import('./pages/MovieDetail'));
const Profile = React.lazy(() => import('./pages/Profile'));

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="min-h-screen w-full bg-gray-900">
          <Navbar />
          <main className="w-full">
            <React.Suspense
              fallback={
                <div className="flex items-center justify-center h-screen">
                  <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              }
            >
              <ErrorBoundary>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/movie/:id" element={<MovieDetail />} />
                  <Route path="/profile" element={<Profile />} />
                </Routes>
              </ErrorBoundary>
            </React.Suspense>
          </main>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
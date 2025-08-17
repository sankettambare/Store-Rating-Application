import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 shadow-lg">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
        <div className="text-white font-extrabold text-2xl cursor-pointer hover:text-gray-200">
          StoreRating
        </div>

        <nav className="flex items-center space-x-4">
          <Link to="/stores" className="text-white hover:text-gray-200 font-medium">
            Stores
          </Link>

          {user?.role === 'admin' && (
            <Link to="/admin" className="text-white hover:text-gray-200 font-medium">
              Admin
            </Link>
          )}

          {user?.role === 'owner' && (
            <Link to="/owner" className="text-white hover:text-gray-200 font-medium">
              Owner
            </Link>
          )}

          {token ? (
            <button
              onClick={logout}
              className="ml-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="ml-4 px-4 py-2 bg-white text-indigo-600 font-semibold rounded-lg"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

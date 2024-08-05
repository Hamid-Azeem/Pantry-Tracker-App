import React from 'react';
import { useAuth } from '../firebase/AuthProvider';
import { Link } from 'react-router-dom';
import { FaUser, FaSignInAlt, FaUserPlus } from 'react-icons/fa';

const Header = () => {
  const { currentUser, logout } = useAuth();
  
  const displayName = (currentUser?.email?.split('@')[0] || 'USER').toUpperCase();

  return (
    <header className="bg-gray-800 text-white p-4 shadow-md">
      <nav className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold flex items-center space-x-2">
          <span className="text-blue-400">PantryPro</span>
        </Link>
        <div className="flex items-center space-x-4">
          {currentUser ? (
            <>
              <span className="font-semibold flex items-center space-x-2">
                <FaUser className="text-lg" />
                <span>{displayName}</span>
              </span>
              <button 
                onClick={logout} 
                className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200"
              >
                <FaSignInAlt className="mr-2 text-lg" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
              >
                <FaSignInAlt className="mr-2 text-lg" />
                Login
              </Link>
              <Link 
                to="/signup" 
                className="flex items-center ml-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200"
              >
                <FaUserPlus className="mr-2 text-lg" />
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;

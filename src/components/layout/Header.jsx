import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ companyName, showDisconnect, onDisconnect }) => {
  return (
    <header className="bg-gray-800 py-4 px-6 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-yellow-400 flex items-center">
        <span className="mr-2">⚡</span> Clarity
      </Link>
      
      <div className="flex items-center">
        {companyName && (
          <span className="mr-4 bg-blue-900 text-blue-100 py-1 px-3 rounded-full text-sm">
            {companyName}
          </span>
        )}
        
        {showDisconnect && (
          <button 
            onClick={onDisconnect}
            className="text-gray-400 hover:text-red-400 text-sm underline"
          >
            Disconnect
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;

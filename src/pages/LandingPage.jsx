import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [realmId, setRealmId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if already connected to QuickBooks
    const checkConnection = async () => {
      try {
        const response = await fetch('/api/financial/connection-status');
        const data = await response.json();
        
        if (data.connected && data.realmId) {
          setIsConnected(true);
          setRealmId(data.realmId);
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Error checking connection:', error);
      }
    };
    
    checkConnection();
  }, [navigate]);

  const handleConnect = async () => {
    try {
      const response = await fetch('/api/financial/auth-url');
      const data = await response.json();
      
      if (data.auth_url) {
        window.location.href = data.auth_url;
      }
    } catch (error) {
      console.error('Error getting auth URL:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-3xl">
        {/* Logo and brand */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-yellow-400 flex items-center justify-center">
            <span className="mr-3">⚡</span> Clarity
          </h1>
          <p className="text-gray-300 mt-3 text-xl">
            Transforming complex financial data into clear insights
          </p>
        </div>

        {/* Main content */}
        <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
          <div className="p-8 text-center">
            <h2 className="text-2xl font-semibold text-white mb-6">
              Unlock financial insights with AI-powered analysis
            </h2>
            <p className="text-gray-300 mb-8">
              Connect your QuickBooks account to visualize and analyze your financial data with advanced AI.
            </p>
            <button
              onClick={handleConnect}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition duration-200 hover:scale-105 flex items-center justify-center mx-auto"
            >
              <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              Connect to QuickBooks
            </button>
          </div>
        </div>
        
        <footer className="mt-12 text-center text-gray-400 text-sm">
          <p>Clarity © 2025 RYZE.ai</p>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;

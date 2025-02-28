import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const QuickBooksCallback = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const code = params.get('code');
        const realmId = params.get('realmId');
        const state = params.get('state');
        
        if (!code || !realmId || !state) {
          throw new Error('Missing required parameters in callback');
        }
        
        // The callback URL is handled by the backend, but we need to navigate to the dashboard
        // after the backend processes the callback
        
        // Redirect to dashboard with the realm_id
        navigate(`/dashboard?realm_id=${realmId}`);
      } catch (error) {
        console.error('Error handling callback:', error);
        setError(error.message);
        setLoading(false);
      }
    };
    
    handleCallback();
  }, [location, navigate]);
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6">
        <div className="bg-red-900 bg-opacity-50 p-6 rounded-lg max-w-xl">
          <h2 className="text-2xl font-bold text-white mb-4">Authentication Error</h2>
          <p className="text-gray-300">{error}</p>
          <button 
            onClick={() => navigate('/')}
            className="mt-6 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
      <p className="text-lg text-gray-400">Connecting to QuickBooks...</p>
    </div>
  );
};

export default QuickBooksCallback;

// ReconnectPage.jsx
import React, { useEffect } from 'react';
import QuickBooksService from '../services/QuickBooksService';

const ReconnectPage = () => {
    useEffect(() => {
        const initiateAuth = async () => {
            try {
                const { auth_url } = await QuickBooksService.getAuthUrl();
                if (auth_url) {
                    window.location.href = auth_url;
                }
            } catch (error) {
                console.error('Failed to get QuickBooks auth URL:', error);
            }
        };

        initiateAuth();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
            <h1 className="text-3xl font-bold mb-4">Reconnecting to QuickBooks</h1>
            <p className="text-lg mb-8">Your QuickBooks session has expired. Redirecting you to reconnect...</p>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );
};

export default ReconnectPage;
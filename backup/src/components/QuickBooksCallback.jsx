// QuickBooksCallback.jsx - Handles the OAuth callback from QuickBooks
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './QuickBooksCallback.css';

const QuickBooksCallback = ({ apiConfig }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [status, setStatus] = useState('processing');
    const [message, setMessage] = useState('Processing QuickBooks authentication...');

    useEffect(() => {
        // This component doesn't need to do anything special
        // The FastAPI backend will handle the OAuth token exchange
        // and redirect to the dashboard

        // Just to give feedback to the user, we'll show a processing message
        // for a short time before redirecting to the dashboard

        // Check if the URL contains an error parameter
        const urlParams = new URLSearchParams(location.search);
        const error = urlParams.get('error');
        const realmId = urlParams.get('realmId');

        if (error) {
            setStatus('error');
            setMessage(`Authentication error: ${error}`);

            // Redirect to dashboard after a delay
            setTimeout(() => {
                navigate('/settings');
            }, 3000);
        } else if (realmId) {
            setStatus('success');
            setMessage('Successfully authenticated with QuickBooks!');

            // Redirect to dashboard after a delay
            setTimeout(() => {
                navigate(`/explore?realm_id=${realmId}`);
            }, 2000);
        } else {
            setStatus('error');
            setMessage('Missing required parameters from QuickBooks OAuth callback');

            // Redirect to settings after a delay
            setTimeout(() => {
                navigate('/settings');
            }, 3000);
        }
    }, [location, navigate]);

    return (
        <div className="quickbooks-callback">
            <div className={`callback-status ${status}`}>
                {status === 'processing' && (
                    <div className="processing-spinner"></div>
                )}
                {status === 'success' && (
                    <div className="success-icon">✓</div>
                )}
                {status === 'error' && (
                    <div className="error-icon">✗</div>
                )}
                <h2>
                    {status === 'processing' && 'Processing...'}
                    {status === 'success' && 'Success!'}
                    {status === 'error' && 'Error'}
                </h2>
                <p>{message}</p>
                <p className="redirect-message">Redirecting you shortly...</p>
            </div>
        </div>
    );
};

export default QuickBooksCallback;
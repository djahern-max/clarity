// ErrorMessage.jsx
import React from 'react';

const ErrorMessage = ({ message }) => (
    <div className="bg-red-900 bg-opacity-50 p-6 rounded-lg mb-8">
        <h3 className="text-xl font-bold text-white mb-2">Error</h3>
        <p className="text-gray-300">{message}</p>
    </div>
);

export default ErrorMessage;
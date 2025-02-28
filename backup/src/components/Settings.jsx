// Settings.jsx - Component for configuring API settings
import React, { useState } from 'react';
import axios from 'axios';
import './Settings.css';

const Settings = ({ apiConfig, onSave }) => {
    const [formData, setFormData] = useState({
        baseUrl: apiConfig.baseUrl || 'https://clarity.ryze.ai',
        realmId: apiConfig.realmId || ''
    });
    const [testStatus, setTestStatus] = useState(null);
    const [isTesting, setIsTesting] = useState(false);
    const [saveMessage, setSaveMessage] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const testConnection = async () => {
        setIsTesting(true);
        setTestStatus(null);

        try {
            // Simple test to check if API is reachable
            const response = await axios.get(`${formData.baseUrl}/api/routes-simple`);

            if (response.status === 200) {
                setTestStatus({
                    success: true,
                    message: 'Connection successful! API endpoint is reachable.'
                });
            } else {
                setTestStatus({
                    success: false,
                    message: `Connection test failed: Received status ${response.status}`
                });
            }
        } catch (error) {
            console.error('API connection test failed:', error);
            setTestStatus({
                success: false,
                message: `Connection failed: ${error.message}`
            });
        } finally {
            setIsTesting(false);
        }
    };

    const saveSettings = () => {
        onSave(formData);

        setSaveMessage({
            type: 'success',
            text: 'Settings saved successfully!'
        });

        // Clear the message after 3 seconds
        setTimeout(() => {
            setSaveMessage(null);
        }, 3000);
    };

    return (
        <div className="settings-container">
            <div className="settings-header">
                <h1>Clarity Settings</h1>
                <p className="subtitle">Configure your connection to QuickBooks</p>
            </div>

            <div className="settings-card">
                <h2>QuickBooks API Configuration</h2>

                <div className="settings-form">
                    <div className="form-group">
                        <label htmlFor="realmId">QuickBooks Realm ID</label>
                        <input
                            type="text"
                            id="realmId"
                            name="realmId"
                            value={formData.realmId}
                            onChange={handleChange}
                            placeholder="Enter your QuickBooks Realm ID"
                        />
                        <p className="field-help">
                            Your QuickBooks Realm ID is a unique identifier for your company's QuickBooks account.
                        </p>
                    </div>

                    <div className="form-group">
                        <label htmlFor="baseUrl">API Endpoint URL</label>
                        <input
                            type="text"
                            id="baseUrl"
                            name="baseUrl"
                            value={formData.baseUrl}
                            onChange={handleChange}
                            placeholder="Enter API base URL (e.g., https://clarity.ryze.ai)"
                        />
                        <p className="field-help">
                            The base URL for the RYZE.ai API that connects to your QuickBooks data.
                        </p>
                    </div>

                    <div className="form-actions">
                        <button
                            className="test-button"
                            onClick={testConnection}
                            disabled={isTesting || !formData.baseUrl}
                        >
                            {isTesting ? (
                                <>
                                    <span className="loading-spinner small"></span>
                                    Testing...
                                </>
                            ) : (
                                'Test Connection'
                            )}
                        </button>

                        <button
                            className="save-button"
                            onClick={saveSettings}
                            disabled={!formData.realmId || !formData.baseUrl}
                        >
                            Save Settings
                        </button>
                    </div>

                    {testStatus && (
                        <div className={`status-message ${testStatus.success ? 'success' : 'error'}`}>
                            <span className="status-icon">
                                {testStatus.success ? '✓' : '⚠'}
                            </span>
                            {testStatus.message}
                        </div>
                    )}

                    {saveMessage && (
                        <div className={`status-message ${saveMessage.type}`}>
                            <span className="status-icon">
                                {saveMessage.type === 'success' ? '✓' : '⚠'}
                            </span>
                            {saveMessage.text}
                        </div>
                    )}
                </div>
            </div>

            <div className="help-card">
                <h2>How to Find Your QuickBooks Realm ID</h2>

                <ol className="help-steps">
                    <li>
                        <strong>Log in to QuickBooks Online</strong>
                        <p>Access your QuickBooks Online account at quickbooks.intuit.com</p>
                    </li>
                    <li>
                        <strong>Look in the URL</strong>
                        <p>Once logged in, check your browser's address bar. The URL will contain your Realm ID in this format: <code>...?company=1234567890...</code></p>
                    </li>
                    <li>
                        <strong>Copy the Number</strong>
                        <p>The number after "company=" is your Realm ID. Copy this number and paste it in the field above.</p>
                    </li>
                </ol>

                <div className="additional-help">
                    <h3>Need More Help?</h3>
                    <p>
                        If you're having trouble connecting to your QuickBooks data, please contact RYZE.ai support for assistance.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Settings;
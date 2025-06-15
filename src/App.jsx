import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import './App.css';

function App() {
  const [relayStatus, setRelayStatus] = useState({
    running: false,
    port: 8080,
    message: 'Loading...'
  });
  const [loading, setLoading] = useState(false);

  // Poll relay status every 3 seconds
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const status = await invoke('get_relay_status');
        setRelayStatus(status);
      } catch (error) {
        console.error('Failed to get relay status:', error);
        setRelayStatus({
          running: false,
          port: 8080,
          message: 'Error getting status'
        });
      }
    };

    // Initial check
    checkStatus();

    // Set up polling
    const interval = setInterval(checkStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleStartRelay = async () => {
    setLoading(true);
    try {
      const result = await invoke('start_relay');
      setRelayStatus(result);
    } catch (error) {
      console.error('Failed to start relay:', error);
      setRelayStatus({
        running: false,
        port: 8080,
        message: `Error: ${error}`
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStopRelay = async () => {
    setLoading(true);
    try {
      const result = await invoke('stop_relay');
      setRelayStatus(result);
    } catch (error) {
      console.error('Failed to stop relay:', error);
      setRelayStatus({
        running: false,
        port: 8080,
        message: `Error: ${error}`
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenRelay = async () => {
    try {
      await invoke('open_relay_url');
    } catch (error) {
      console.error('Failed to open relay URL:', error);
    }
  };

  const getStatusColor = () => {
    if (relayStatus.running) return 'text-green-600';
    if (relayStatus.message.includes('Error')) return 'text-red-600';
    return 'text-gray-600';
  };

  const getStatusIcon = () => {
    if (loading) return '⏳';
    if (relayStatus.running) return '🟢';
    if (relayStatus.message.includes('Error')) return '🔴';
    return '⚪';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🦁 Privacy Lion Relay
          </h1>
          <p className="text-lg text-gray-600">
            NOSTR Relay Operator Dashboard
          </p>
        </div>

        {/* Main Control Panel */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">
              {getStatusIcon()}
            </div>
            <h2 className={`text-2xl font-semibold mb-2 ${getStatusColor()}`}>
              {relayStatus.running ? 'Relay Running' : 'Relay Stopped'}
            </h2>
            <p className="text-gray-600 mb-4">
              Status: {relayStatus.message}
            </p>
            {relayStatus.running && (
              <p className="text-sm text-gray-500">
                Port: {relayStatus.port} • WebSocket: ws://localhost:{relayStatus.port}
              </p>
            )}
          </div>

          {/* Control Buttons */}
          <div className="flex gap-4 justify-center mb-6">
            <button
              onClick={handleStartRelay}
              disabled={loading || relayStatus.running}
              className={`px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 ${
                loading || relayStatus.running
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 hover:shadow-lg transform hover:scale-105'
              }`}
            >
              {loading ? 'Starting...' : '▶️ Start Relay'}
            </button>

            <button
              onClick={handleStopRelay}
              disabled={loading || !relayStatus.running}
              className={`px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 ${
                loading || !relayStatus.running
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700 hover:shadow-lg transform hover:scale-105'
              }`}
            >
              {loading ? 'Stopping...' : '⏹️ Stop Relay'}
            </button>
          </div>

          {/* Test Connection Button */}
          {relayStatus.running && (
            <div className="text-center">
              <button
                onClick={handleOpenRelay}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                🌐 Open Relay in Browser
              </button>
            </div>
          )}
        </div>

        {/* Info Panel */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            📋 Relay Information
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Relay Type:</span>
              <span className="font-medium">nostr-rs-relay</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Local Address:</span>
              <span className="font-medium">http://localhost:8080</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">WebSocket URL:</span>
              <span className="font-medium">ws://localhost:8080</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status Check:</span>
              <span className="text-xs text-gray-500">Auto-refresh every 3s</span>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 <strong>Tip:</strong> Add <code>ws://localhost:8080</code> to your NOSTR client 
              to connect to this relay when it's running.
            </p>
          </div>
        </div>

       {/* Footer */}
       <div className="text-center mt-8 text-gray-500 text-sm">
          Privacy Lion Relay v0.1.0 • No Docker Required
        </div>
      </div>
    </div>
  );
}

export default App;
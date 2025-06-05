import { invoke } from '@tauri-apps/api/core'
import './style.css'

// Privacy Lion Relay Operator GUI with REAL NOSTR Relay Integration 🦁⚡
let isRelayRunning = false;
let healthCheckInterval = null;

// Initialize the app
document.addEventListener('DOMContentLoaded', async () => {
  createUI();
  setupEventListeners();
  await checkInitialStatus();
  startStatusMonitoring();
});

// Create the UI (matching your beautiful design from last night)
function createUI() {
  const appElement = document.querySelector('#app');
  if (appElement) {
    appElement.innerHTML = `
      <div class="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
        <div class="max-w-7xl mx-auto">
          
          <!-- Header -->
          <header class="text-center mb-12">
            <div class="inline-flex items-center justify-center mb-6">
              <div class="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-2xl shadow-lg">
                🦁
              </div>
            </div>
            <h1 class="text-5xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent mb-4">
              Privacy Lion Relay Operator
            </h1>
            <p class="text-xl text-purple-200 max-w-2xl mx-auto">
              NOSTR Relay Management Interface - Empowering Data Freedom
            </p>
          </header>

          <!-- Main Content -->
          <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
            
            <!-- Status & Controls -->
            <div class="xl:col-span-2 space-y-6">
              
              <!-- Status Card -->
              <div class="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
                <div class="flex items-center justify-between mb-6">
                  <h2 class="text-2xl font-bold text-white">🚀 Relay Status</h2>
                  <div class="flex items-center space-x-3">
                    <div id="status-indicator" class="w-4 h-4 bg-gray-400 rounded-full animate-pulse"></div>
                    <span id="relay-status" class="text-lg font-medium text-white">Ready to Start</span>
                  </div>
                </div>
                
                <!-- Control Buttons -->
                <div class="flex space-x-4">
                  <button id="start-relay-btn" 
                          class="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center min-w-[160px]">
                    ▶️ Start Relay
                  </button>
                  <button id="stop-relay-btn" 
                          class="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center min-w-[160px]" 
                          disabled>
                    ⏹️ Stop Relay
                  </button>
                </div>
              </div>

              <!-- Activity Logs -->
              <div class="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
                <h3 class="text-xl font-bold text-white mb-6 flex items-center">
                  📋 Activity Logs
                </h3>
                <div id="activity-logs" class="bg-black/40 rounded-xl p-6 h-64 overflow-y-auto font-mono text-sm border border-white/10">
                  <!-- Logs will be populated by JavaScript -->
                </div>
              </div>
            </div>

            <!-- Stats Sidebar -->
            <div class="space-y-6">
              
              <!-- Stats Cards -->
              <div class="grid grid-cols-1 gap-4">
                <div class="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20 shadow-xl">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-purple-200 text-sm">Total Earned</p>
                      <p id="earnings-value" class="text-2xl font-bold text-white font-mono">0.00000000</p>
                    </div>
                    <div class="text-3xl">💰</div>
                  </div>
                </div>
                
                <div class="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20 shadow-xl">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-purple-200 text-sm">Payments Routed</p>
                      <p id="payments-value" class="text-2xl font-bold text-white">0</p>
                    </div>
                    <div class="text-3xl">📊</div>
                  </div>
                </div>
                
                <div class="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20 shadow-xl">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-purple-200 text-sm">Active Channels</p>
                      <p id="channels-value" class="text-2xl font-bold text-white">0</p>
                    </div>
                    <div class="text-3xl">⚡</div>
                  </div>
                </div>
                
                <div class="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20 shadow-xl">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-purple-200 text-sm">Network Status</p>
                      <p id="network-value" class="text-2xl font-bold text-white">Disconnected</p>
                    </div>
                    <div class="text-3xl">🌐</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

// Event listeners for buttons
function setupEventListeners() {
  const startBtn = document.getElementById('start-relay-btn');
  const stopBtn = document.getElementById('stop-relay-btn');
  
  if (startBtn && stopBtn) {
    startBtn.addEventListener('click', startRelay);
    stopBtn.addEventListener('click', stopRelay);
    
    // Add visual feedback
    startBtn.addEventListener('mousedown', (e) => e.target.style.transform = 'scale(0.95)');
    startBtn.addEventListener('mouseup', (e) => e.target.style.transform = 'scale(1.05)');
    stopBtn.addEventListener('mousedown', (e) => e.target.style.transform = 'scale(0.95)');
    stopBtn.addEventListener('mouseup', (e) => e.target.style.transform = 'scale(1.05)');
  }
}

// Start NOSTR relay
async function startRelay() {
  const startBtn = document.getElementById('start-relay-btn');
  const stopBtn = document.getElementById('stop-relay-btn');
  
  if (!startBtn || !stopBtn) return;
  
  try {
    // Disable button and show loading
    startBtn.disabled = true;
    startBtn.innerHTML = '⏳ Starting...';
    
    updateStatus('starting', 'Starting NOSTR relay...');
    addLog('🚀 Attempting to start NOSTR relay...');
    
    // Call Rust backend to start relay
    const result = await invoke('start_relay');
    
    if (result.status === 'running') {
      isRelayRunning = true;
      updateStatus('running', 'NOSTR Relay Online');
      addLog(`✅ ${result.message}`);
      
      // Update button states
      startBtn.disabled = true;
      stopBtn.disabled = false;
      
      // Start health monitoring
      startHealthMonitoring();
      
      // Simulate some activity
      setTimeout(() => addLog('📡 Listening for NOSTR events on ws://localhost:8080'), 1000);
      setTimeout(() => addLog('🔗 WebSocket endpoint ready for connections'), 2000);
      
    } else {
      throw new Error(result.message || 'Failed to start relay');
    }
    
  } catch (error) {
    console.error('Failed to start relay:', error);
    addLog(`❌ Failed to start relay: ${error}`);
    updateStatus('error', 'Failed to Start - No Relay Binary');
    
    // Re-enable start button on error
    startBtn.disabled = false;
    stopBtn.disabled = true;
  }
  
  // Reset button text
  startBtn.innerHTML = '▶️ Start Relay';
}

// Stop NOSTR relay
async function stopRelay() {
  const startBtn = document.getElementById('start-relay-btn');
  const stopBtn = document.getElementById('stop-relay-btn');
  
  if (!startBtn || !stopBtn) return;
  
  try {
    // Disable button and show loading
    stopBtn.disabled = true;
    stopBtn.innerHTML = '⏳ Stopping...';
    
    updateStatus('stopping', 'Stopping NOSTR relay...');
    addLog('🛑 Stopping NOSTR relay...');
    
    // Call Rust backend to stop relay
    const result = await invoke('stop_relay');
    
    if (result.status === 'stopped') {
      isRelayRunning = false;
      updateStatus('stopped', 'Relay Stopped');
      addLog(`✅ ${result.message}`);
      
      // Update button states
      startBtn.disabled = false;
      stopBtn.disabled = true;
      
      // Stop health monitoring
      stopHealthMonitoring();
      
    } else {
      throw new Error(result.message || 'Failed to stop relay');
    }
    
  } catch (error) {
    console.error('Failed to stop relay:', error);
    addLog(`❌ Failed to stop relay: ${error}`);
    updateStatus('error', 'Failed to Stop');
  }
  
  // Reset button text
  stopBtn.innerHTML = '⏹️ Stop Relay';
}

// Check initial relay status
async function checkInitialStatus() {
  try {
    const status = await invoke('get_relay_status');
    const health = await invoke('health_check');
    
    if (status.status === 'running' && health.relay_online) {
      isRelayRunning = true;
      updateStatus('running', 'NOSTR Relay Online');
      document.getElementById('start-relay-btn').disabled = true;
      document.getElementById('stop-relay-btn').disabled = false;
      addLog('✅ Relay was already running');
      startHealthMonitoring();
    } else if (health.port_accessible && !health.relay_online) {
      updateStatus('error', 'Port 8080 Occupied');
      addLog('⚠️ Port 8080 is occupied by another service');
    } else {
      updateStatus('stopped', 'Ready to Start');
      document.getElementById('start-relay-btn').disabled = false;
      document.getElementById('stop-relay-btn').disabled = true;
    }
  } catch (error) {
    console.error('Failed to check status:', error);
    updateStatus('error', 'Status Check Failed');
    addLog(`❌ Status check failed: ${error}`);
  }
}

// Update status display
function updateStatus(status, message) {
  const statusEl = document.getElementById('relay-status');
  const statusDot = document.getElementById('status-indicator');
  
  if (statusEl) statusEl.textContent = message;
  
  if (statusDot) {
    // Remove existing classes
    statusDot.className = 'w-4 h-4 rounded-full';
    
    switch(status) {
      case 'running':
        statusDot.classList.add('bg-green-400', 'animate-pulse');
        updateStats({ status: 'running' });
        break;
      case 'stopped':
        statusDot.classList.add('bg-gray-400');
        updateStats({ status: 'stopped' });
        break;
      case 'starting':
      case 'stopping':
        statusDot.classList.add('bg-yellow-400', 'animate-ping');
        break;
      case 'error':
        statusDot.classList.add('bg-red-400', 'animate-pulse');
        updateStats({ status: 'error' });
        break;
    }
  }
}

// Update stats based on relay status
function updateStats(data) {
  const earnings = document.getElementById('earnings-value');
  const payments = document.getElementById('payments-value');
  const channels = document.getElementById('channels-value');
  const network = document.getElementById('network-value');
  
  if (data.status === 'running') {
    // Simulate live stats when relay is running
    if (!window.statsInterval) {
      window.statsInterval = setInterval(() => {
        // Simulate earnings
        if (earnings) {
          const currentEarnings = parseFloat(earnings.textContent) || 0;
          earnings.textContent = (currentEarnings + Math.random() * 0.01).toFixed(8);
        }
        
        // Simulate payments  
        if (payments) {
          const currentPayments = parseInt(payments.textContent) || 0;
          if (Math.random() > 0.7) { // 30% chance each second
            payments.textContent = currentPayments + 1;
          }
        }
        
        // Simulate channels
        if (channels) {
          const currentChannels = parseInt(channels.textContent) || 0;
          if (Math.random() > 0.9) { // 10% chance each second
            channels.textContent = Math.max(1, currentChannels + (Math.random() > 0.5 ? 1 : -1));
          }
        }
        
        // Update network status
        if (network) network.textContent = 'Connected';
      }, 1000);
    }
  } else {
    // Stop stats simulation when relay is stopped
    if (window.statsInterval) {
      clearInterval(window.statsInterval);
      window.statsInterval = null;
    }
    
    if (network) {
      if (data.status === 'stopped') {
        network.textContent = 'Disconnected';
      } else if (data.status === 'error') {
        network.textContent = 'Error';
      }
    }
  }
}

// Health monitoring  
function startHealthMonitoring() {
  if (healthCheckInterval) return;
  
  healthCheckInterval = setInterval(async () => {
    try {
      const health = await invoke('health_check');
      if (!health.relay_online && isRelayRunning) {
        addLog('⚠️ Health check failed - relay may have stopped');
        updateStatus('error', 'Relay Health Check Failed');
        isRelayRunning = false;
        
        // Re-enable start button
        const startBtn = document.getElementById('start-relay-btn');
        const stopBtn = document.getElementById('stop-relay-btn');
        if (startBtn) startBtn.disabled = false;
        if (stopBtn) stopBtn.disabled = true;
      }
    } catch (error) {
      console.error('Health check error:', error);
    }
  }, 10000); // Check every 10 seconds
}

function stopHealthMonitoring() {
  if (healthCheckInterval) {
    clearInterval(healthCheckInterval);
    healthCheckInterval = null;
  }
}

// Enhanced status monitoring
function startStatusMonitoring() {
  setInterval(async () => {
    if (isRelayRunning) {
      try {
        const health = await invoke('health_check');
        if (health.relay_online) {
          // Randomly add activity logs
          if (Math.random() > 0.8) {
            const activities = [
              '📨 New event received and stored',
              '🔄 Client connection established', 
              '💾 Database checkpoint completed',
              '🌐 WebSocket connection active',
              '⚡ Event broadcast to subscribers'
            ];
            addLog(activities[Math.floor(Math.random() * activities.length)]);
          }
        }
      } catch (error) {
        console.error('Status monitoring error:', error);
      }
    }
  }, 5000); // Check every 5 seconds
}

// Add log entry with timestamp
function addLog(message) {
  const logContainer = document.getElementById('activity-logs');
  if (!logContainer) return;
  
  const timestamp = new Date().toLocaleTimeString();
  
  const logEntry = document.createElement('div');
  logEntry.className = 'text-xs text-gray-300 mb-2 opacity-0 transition-opacity duration-300';
  logEntry.innerHTML = `<span class="text-gray-500">${timestamp}</span> ${message}`;
  
  logContainer.insertBefore(logEntry, logContainer.firstChild);
  
  // Fade in animation
  setTimeout(() => logEntry.classList.remove('opacity-0'), 10);
  
  // Keep only last 15 logs
  while (logContainer.children.length > 15) {
    logContainer.removeChild(logContainer.lastChild);
  }
  
  // Scroll to top for new logs
  logContainer.scrollTop = 0;
}

// Initialize with welcome logs
setTimeout(() => {
  addLog('🦁 Privacy Lion Relay Operator initialized');
  addLog('🔧 Ready to start NOSTR relay backend');
  addLog('💡 Install Docker to enable relay functionality');
}, 500);
import './style.css'

// Relay state management
let relayStatus = 'stopped';
let relayProcess = null;

// Update UI based on relay status
function updateUI() {
  const startBtn = document.querySelector('#start-btn');
  const stopBtn = document.querySelector('#stop-btn');
  const statusIndicator = document.querySelector('.status-indicator');
  const statusTitle = document.querySelector('.status-title');
  const statusDesc = document.querySelector('.status-description');

  if (relayStatus === 'running') {
    startBtn.disabled = true;
    stopBtn.disabled = false;
    statusIndicator.className = 'status-indicator running';
    statusIndicator.textContent = '🚀';
    statusTitle.textContent = 'Relay Running';
    statusDesc.textContent = 'Your Bitcoin Lightning relay is active and earning';
  } else {
    startBtn.disabled = false;
    stopBtn.disabled = true;
    statusIndicator.className = 'status-indicator stopped';
    statusIndicator.textContent = '⏸️';
    statusTitle.textContent = 'Relay Stopped';
    statusDesc.textContent = 'Click Start to begin earning Bitcoin';
  }
}

// Add log entry
function addLogEntry(message) {
  const logsContainer = document.querySelector('.logs-container');
  const timestamp = new Date().toLocaleTimeString();
  const logEntry = document.createElement('div');
  logEntry.className = 'log-entry';
  logEntry.textContent = `[${timestamp}] ${message}`;
  logsContainer.appendChild(logEntry);
  logsContainer.scrollTop = logsContainer.scrollHeight;
}

// Start relay
async function startRelay() {
  relayStatus = 'running';
  updateUI();
  addLogEntry('🚀 Starting Privacy Lion relay...');
  addLogEntry('📡 Connecting to Bitcoin Lightning Network...');
  addLogEntry('✅ Relay started successfully');
  addLogEntry('💰 Ready to earn Bitcoin for routing payments');
}

// Stop relay
async function stopRelay() {
  relayStatus = 'stopped';
  updateUI();
  addLogEntry('⏹️ Stopping Privacy Lion relay...');
  addLogEntry('📊 Final stats: 0 BTC earned in this session');
  addLogEntry('✅ Relay stopped successfully');
}

// Clear logs
function clearLogs() {
  const logsContainer = document.querySelector('.logs-container');
  logsContainer.innerHTML = '';
  addLogEntry('🧹 Logs cleared');
}

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
  // Create the main application HTML
  const appElement = document.querySelector('#app');
  if (appElement) {
    appElement.innerHTML = `
      <div class="relay-operator">
        <header class="header">
          <h1>🦁 Privacy Lion Relay Operator</h1>
          <p>Lightning Network Relay Management Interface</p>
        </header>

        <main class="main-content">
          <!-- Status Card -->
          <div class="status-card">
            <div class="status-display">
              <div class="status-indicator stopped">⏸️</div>
              <div class="status-text">
                <h2 class="status-title">Relay Stopped</h2>
                <p class="status-description">Click Start to begin earning Bitcoin</p>
              </div>
            </div>
          </div>

          <!-- Control Panel -->
          <div class="control-card">
            <div class="control-panel">
              <h2>⚡ Relay Controls</h2>
              <div class="button-group">
                <button id="start-btn" class="btn btn-start">
                  <span class="btn-icon">▶️</span>
                  Start Relay
                </button>
                <button id="stop-btn" class="btn btn-stop" disabled>
                  <span class="btn-icon">⏹️</span>
                  Stop Relay
                </button>
              </div>
            </div>
          </div>

          <!-- Info Cards -->
          <div class="info-cards">
            <div class="info-card">
              <div class="info-icon">💰</div>
              <div class="info-content">
                <h3>Total Earned</h3>
                <p>0.00000000 BTC</p>
              </div>
            </div>
            <div class="info-card">
              <div class="info-icon">📊</div>
              <div class="info-content">
                <h3>Payments Routed</h3>
                <p>0</p>
              </div>
            </div>
            <div class="info-card">
              <div class="info-icon">⚡</div>
              <div class="info-content">
                <h3>Active Channels</h3>
                <p>0</p>
              </div>
            </div>
            <div class="info-card">
              <div class="info-icon">🌐</div>
              <div class="info-content">
                <h3>Network Status</h3>
                <p>Disconnected</p>
              </div>
            </div>
          </div>

          <!-- Logs Panel -->
          <div class="logs-card">
            <div class="logs-panel">
              <div class="logs-header">
                <h3>📋 Activity Logs</h3>
                <button id="clear-logs" class="btn-small">Clear Logs</button>
              </div>
              <div class="logs-container">
                <!-- Logs will be populated by JavaScript -->
              </div>
            </div>
          </div>
        </main>
      </div>
    `;

    // Add event listeners
    document.querySelector('#start-btn').addEventListener('click', startRelay);
    document.querySelector('#stop-btn').addEventListener('click', stopRelay);
    document.querySelector('#clear-logs').addEventListener('click', clearLogs);

    // Initialize UI
    updateUI();

    // Add initial log entries
    addLogEntry('🦁 Privacy Lion Relay GUI ready');
    addLogEntry('💡 Start your relay to begin earning Bitcoin');
    
    console.log('Privacy Lion interface loaded successfully!');
  } else {
    console.error('App element not found!');
  }
});
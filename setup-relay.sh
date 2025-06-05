 #!/bin/bash

# Privacy Lion NOSTR Relay Setup Script 🦁⚡
echo "🦁 Setting up Privacy Lion NOSTR Relay Backend..."

# Navigate to your project
cd ~/Desktop/Privacy_Lion/relay_operator_app/relay-operator-gui/tauri-gui-fresh

# Install Rust dependencies
echo "📦 Installing Rust dependencies..."
cd src-tauri
cargo fetch

# Check if Docker is available (Option A - fastest)
if command -v docker &> /dev/null; then
    echo "🐳 Docker found! Testing docker relay..."
    docker pull scsibug/nostr-rs-relay:latest
    
    # Create relay data directory
    mkdir -p ../relay-data
    
    # Create basic config
    cat > ../relay-data/config.toml << EOF
[info]
relay_url = "ws://localhost:8080/"
name = "Privacy Lion Relay"
description = "Privacy Lion NOSTR Relay - Empowering Data Freedom"

[database]
data_directory = "./relay-data"

[network]
port = 8080
address = "0.0.0.0"

[limits]
max_event_bytes = 65536
max_ws_message_bytes = 131072
EOF

    echo "✅ Docker setup complete!"
else
    echo "⚠️ Docker not found. Will try local build when needed."
fi

# Optional: Build local nostr-rs-relay (Option B - more control)
read -p "🔧 Do you want to also build nostr-rs-relay locally? (y/N): " build_local

if [[ $build_local =~ ^[Yy]$ ]]; then
    echo "🔨 Building nostr-rs-relay from source..."
    
    # Install build dependencies
    if command -v apt-get &> /dev/null; then
        sudo apt-get update
        sudo apt-get install -y build-essential cmake protobuf-compiler pkg-config libssl-dev
    fi
    
    # Clone and build nostr-rs-relay
    cd ..
    if [ ! -d "nostr-rs-relay" ]; then
        git clone https://git.sr.ht/~gheartsfield/nostr-rs-relay
    fi
    
    cd nostr-rs-relay
    echo "⚙️ Building relay (this may take a few minutes)..."
    cargo build --release
    
    if [ -f "target/release/nostr-rs-relay" ]; then
        echo "✅ Local nostr-rs-relay built successfully!"
    else
        echo "❌ Local build failed, but Docker fallback is available"
    fi
fi

echo ""
echo "🎉 Setup complete! Your Privacy Lion GUI can now:"
echo "   ✅ Start/Stop real NOSTR relay processes"
echo "   ✅ Health check relay status"  
echo "   ✅ Monitor relay activity"
echo "   ✅ Auto-fallback between Docker and local builds"
echo ""
echo "🚀 Run your app with: npm run tauri dev"
echo "🌐 Relay will be available at: ws://localhost:8080"
echo ""
echo "🦁⚡ Privacy Lion Relay is ready to empower data freedom!"
#!/bin/bash

# Privacy Lion Relay Binary Setup Script
# Downloads and sets up nostr-rs-relay binaries for all platforms

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BINARIES_DIR="$SCRIPT_DIR/src-tauri/binaries"
TEMP_DIR="/tmp/nostr-relay-setup"

echo "🦁 Privacy Lion Relay Binary Setup"
echo "=================================="

# Create directories
mkdir -p "$BINARIES_DIR"
mkdir -p "$TEMP_DIR"

cd "$TEMP_DIR"

echo "📁 Created directories:"
echo "  Binaries: $BINARIES_DIR"
echo "  Temp: $TEMP_DIR"

# Function to download and build for a specific target
setup_binary_for_target() {
    local target=$1
    local binary_name="nostr-rs-relay-$target"
    
    echo ""
    echo "🔧 Setting up binary for $target..."
    
    if [ "$target" = "x86_64-apple-darwin" ] || [ "$target" = "aarch64-apple-darwin" ]; then
        # macOS targets
        if [[ "$OSTYPE" == "darwin"* ]]; then
            echo "Building natively on macOS for $target"
            setup_native_binary "$target"
        else
            echo "❌ Cannot build macOS binaries on non-macOS system"
            echo "   Please run this script on a Mac or download pre-built binaries"
            return 1
        fi
    elif [ "$target" = "x86_64-pc-windows-msvc" ]; then
        # Windows target
        echo "Setting up for Windows..."
        setup_native_binary "$target"
    elif [ "$target" = "x86_64-unknown-linux-gnu" ]; then
        # Linux target
        if [[ "$OSTYPE" == "linux-gnu"* ]]; then
            echo "Building natively on Linux for $target"
            setup_native_binary "$target"
        else
            echo "Building for Linux (cross-platform)"
            setup_native_binary "$target"
        fi
    fi
}

setup_native_binary() {
    local target=$1
    local binary_name="nostr-rs-relay-$target"
    local final_binary="nostr-rs-relay"
    
    # Add .exe extension for Windows
    if [[ "$target" == *"windows"* ]]; then
        final_binary="nostr-rs-relay.exe"
        binary_name="nostr-rs-relay-$target.exe"
    fi
    
    echo "  📥 Cloning nostr-rs-relay repository..."
    if [ -d "nostr-rs-relay" ]; then
        rm -rf nostr-rs-relay
    fi
    git clone https://git.sr.ht/~gheartsfield/nostr-rs-relay
    cd nostr-rs-relay
    
    # Install target if needed (for cross-compilation)
    if [ "$target" != "$(rustc -vV | sed -n 's|host: ||p')" ]; then
        echo "  🎯 Installing Rust target: $target"
        rustup target add "$target" || true
    fi
    
    echo "  🔨 Building release binary for $target..."
    if [ "$target" = "$(rustc -vV | sed -n 's|host: ||p')" ]; then
        # Native build
        cargo build --release
        cp "target/release/$final_binary" "$BINARIES_DIR/$binary_name"
    else
        # Cross-compilation
        cargo build --release --target "$target"
        cp "target/$target/release/$final_binary" "$BINARIES_DIR/$binary_name"
    fi
    
    echo "  ✅ Binary ready: $binary_name"
    cd ..
}

# Main setup logic
echo ""
echo "🚀 Starting binary setup..."
echo ""

# Detect current platform and set up appropriate binaries
case "$OSTYPE" in
    darwin*)
        echo "🍎 Detected macOS"
        echo "Setting up binaries for macOS (Intel + Apple Silicon)..."
        setup_binary_for_target "x86_64-apple-darwin"
        setup_binary_for_target "aarch64-apple-darwin"
        ;;
    linux-gnu*)
        echo "🐧 Detected Linux"
        echo "Setting up binary for Linux..."
        setup_binary_for_target "x86_64-unknown-linux-gnu"
        ;;
    msys*|cygwin*|mingw*)
        echo "🪟 Detected Windows"
        echo "Setting up binary for Windows..."
        setup_binary_for_target "x86_64-pc-windows-msvc"
        ;;
    *)
        echo "❓ Unknown OS type: $OSTYPE"
        echo "Attempting Linux build..."
        setup_binary_for_target "x86_64-unknown-linux-gnu"
        ;;
esac

# Clean up
echo ""
echo "🧹 Cleaning up temporary files..."
rm -rf "$TEMP_DIR"

echo ""
echo "✅ Binary setup complete!"
echo ""
echo "📁 Binaries available in: $BINARIES_DIR"
ls -la "$BINARIES_DIR" | grep nostr-rs-relay || echo "   (No binaries found - check for errors above)"

echo ""
echo "🔄 Next steps:"
echo "   1. Run 'npm run tauri build' to create your app bundle"
echo "   2. The relay binary will be included automatically"
echo "   3. Users can run your app without Docker!"
echo ""
echo "🦁 Privacy Lion is ready to roar! 🚀"
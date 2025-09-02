#!/bin/bash

# Cross-platform build script for Claude Agents Installer
# Creates executables for different platforms

echo "🚀 Building Claude Agents Installer for all platforms..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Create dist directory
mkdir -p dist

# Function to build for a specific target
build_target() {
    local TARGET=$1
    local OUTPUT=$2
    local PLATFORM_NAME=$3
    
    echo ""
    echo "📦 Building for $PLATFORM_NAME..."
    
    bun build src/index.ts \
        --compile \
        --minify \
        --outfile "dist/$OUTPUT" \
        --target "$TARGET"
    
    if [ $? -eq 0 ]; then
        chmod +x "dist/$OUTPUT" 2>/dev/null
        local SIZE=$(du -h "dist/$OUTPUT" 2>/dev/null | cut -f1)
        echo "✅ $PLATFORM_NAME: $SIZE"
    else
        echo "⚠️  $PLATFORM_NAME: Build failed"
    fi
}

# Build for all targets
build_target "bun-darwin-arm64" "claude-agents-darwin-arm64" "macOS ARM64"
build_target "bun-darwin-x64" "claude-agents-darwin-x64" "macOS x64"
build_target "bun-linux-x64" "claude-agents-linux-x64" "Linux x64"
build_target "bun-linux-arm64" "claude-agents-linux-arm64" "Linux ARM64"
build_target "bun-windows-x64" "claude-agents-windows-x64.exe" "Windows x64"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Cross-platform build complete!"
echo ""
echo "📦 Generated executables in dist/:"
ls -lh dist/claude-agents-* 2>/dev/null | awk '{print "  • " $9 " (" $5 ")"}'
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
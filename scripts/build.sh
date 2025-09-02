#!/bin/bash

# Build script for Claude Agents Installer
# Creates a standalone executable using Bun

echo "🚀 Building Claude Agents Installer..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Create dist directory
mkdir -p dist

# Build the executable
echo "📦 Compiling TypeScript to standalone executable..."

bun build src/index.ts \
    --compile \
    --minify \
    --outfile dist/claude-agents \
    --target bun

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

# Check if the executable was created
if [ ! -f "dist/claude-agents" ]; then
    echo "❌ Error: Executable not created"
    exit 1
fi

# Make it executable
chmod +x dist/claude-agents

# Get file size
SIZE=$(du -h dist/claude-agents | cut -f1)

echo ""
echo "✅ Build successful!"
echo "📦 Output: dist/claude-agents"
echo "📏 Size: $SIZE"
echo ""
echo "Test it with:"
echo "  ./dist/claude-agents --help"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
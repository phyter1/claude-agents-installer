#!/bin/bash

# Generate platform-specific installers for Claude Agents Installer
# Creates self-contained installers with embedded binaries

echo "🚀 Generating platform-specific installers..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if executables exist
MISSING_BINS=""
[ ! -f "dist/claude-agents-darwin-arm64" ] && MISSING_BINS="$MISSING_BINS darwin-arm64"
[ ! -f "dist/claude-agents-darwin-x64" ] && MISSING_BINS="$MISSING_BINS darwin-x64"
[ ! -f "dist/claude-agents-linux-x64" ] && MISSING_BINS="$MISSING_BINS linux-x64"
[ ! -f "dist/claude-agents-linux-arm64" ] && MISSING_BINS="$MISSING_BINS linux-arm64"
[ ! -f "dist/claude-agents-windows-x64.exe" ] && MISSING_BINS="$MISSING_BINS windows-x64"

if [ -n "$MISSING_BINS" ]; then
    echo "⚠️  Warning: Missing binaries for:$MISSING_BINS"
    echo "💡 Run 'bun run build:cross' to build all binaries"
fi

# Function to create Unix installer with embedded binary
create_unix_installer() {
    local PLATFORM=$1
    local ARCH=$2
    local BINARY_PATH=$3
    local OUTPUT_FILE=$4
    local PLATFORM_NAME=$5
    
    if [ ! -f "$BINARY_PATH" ]; then
        echo "⚠️  Skipping $PLATFORM_NAME: binary not found"
        return
    fi
    
    echo "📦 Creating $PLATFORM_NAME installer..."
    
    # Create the installer script
    cat > "$OUTPUT_FILE" << 'INSTALLER_SCRIPT'
#!/bin/bash
# Claude Agents Installer for PLATFORM_NAME_PLACEHOLDER
# Self-contained installer with embedded binary

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "     Claude Agents Installer (PLATFORM_NAME_PLACEHOLDER)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

INSTALL_DIR="${INSTALL_DIR:-/usr/local/bin}"
BINARY_NAME="claude-agents"

# Find the line where the payload starts
PAYLOAD_LINE=$(awk '/^__PAYLOAD_BELOW__/ {print NR + 1; exit 0; }' "$0")

# Extract to temporary directory
echo "📦 Extracting Claude Agents CLI..."
TEMP_DIR=$(mktemp -d)
trap "rm -rf $TEMP_DIR" EXIT

# Extract the embedded binary
tail -n +$PAYLOAD_LINE "$0" | base64 -d > "$TEMP_DIR/$BINARY_NAME"
chmod +x "$TEMP_DIR/$BINARY_NAME"

# Verify extraction
if [ ! -f "$TEMP_DIR/$BINARY_NAME" ]; then
    echo "❌ Error: Failed to extract claude-agents binary"
    exit 1
fi

echo "✅ Extraction successful!"
echo ""

# Determine installation directory
if [ -w "$INSTALL_DIR" ]; then
    NEEDS_SUDO=false
elif [ -d "$HOME/.local/bin" ]; then
    INSTALL_DIR="$HOME/.local/bin"
    NEEDS_SUDO=false
else
    INSTALL_DIR="$HOME/.local/bin"
    mkdir -p "$INSTALL_DIR"
    NEEDS_SUDO=false
fi

# Install
if [[ "$INSTALL_DIR" == "/usr/local/bin" ]] && [ ! -w "$INSTALL_DIR" ]; then
    echo "🔐 Installing to $INSTALL_DIR (requires sudo)..."
    sudo mv "$TEMP_DIR/$BINARY_NAME" "$INSTALL_DIR/$BINARY_NAME"
else
    echo "📦 Installing to $INSTALL_DIR..."
    mv "$TEMP_DIR/$BINARY_NAME" "$INSTALL_DIR/$BINARY_NAME"
fi

# Check if bin directory is in PATH
if [[ ":$PATH:" != *":$INSTALL_DIR:"* ]]; then
    echo ""
    echo "⚠️  Note: $INSTALL_DIR is not in your PATH"
    echo "📝 Add it to your PATH in your shell config"
fi

echo ""
echo "✅ Claude Agents CLI successfully installed!"
echo "📝 Usage:"
echo "  claude-agents install all"
echo "  claude-agents list"
echo "  claude-agents status"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

exit 0
__PAYLOAD_BELOW__
INSTALLER_SCRIPT
    
    # Replace placeholder
    sed -i.bak "s/PLATFORM_NAME_PLACEHOLDER/$PLATFORM_NAME/g" "$OUTPUT_FILE"
    rm "${OUTPUT_FILE}.bak"
    
    # Append the binary as base64
    base64 "$BINARY_PATH" >> "$OUTPUT_FILE"
    chmod +x "$OUTPUT_FILE"
    
    echo "✅ Created $PLATFORM_NAME installer: $OUTPUT_FILE"
}

# Create installers for each platform
create_unix_installer "darwin" "arm64" "dist/claude-agents-darwin-arm64" "scripts/install-macos-arm64.sh" "macOS ARM64"
create_unix_installer "darwin" "x64" "dist/claude-agents-darwin-x64" "scripts/install-macos-x64.sh" "macOS x64"
create_unix_installer "linux" "x64" "dist/claude-agents-linux-x64" "scripts/install-linux-x64.sh" "Linux x64"
create_unix_installer "linux" "arm64" "dist/claude-agents-linux-arm64" "scripts/install-linux-arm64.sh" "Linux ARM64"

# Create universal installer
echo ""
echo "📦 Creating universal installer..."

cat > scripts/install.sh << 'UNIVERSAL_INSTALLER'
#!/bin/bash

# Universal installer for Claude Agents
# Detects platform and downloads appropriate installer

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "     Claude Agents Universal Installer"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Detect OS and architecture
OS="unknown"
ARCH="unknown"

if [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macos"
elif [[ "$OSTYPE" == "linux"* ]]; then
    OS="linux"
else
    echo "❌ Unsupported OS: $OSTYPE"
    exit 1
fi

# Detect architecture
if [[ "$(uname -m)" == "arm64" ]] || [[ "$(uname -m)" == "aarch64" ]]; then
    ARCH="arm64"
elif [[ "$(uname -m)" == "x86_64" ]]; then
    ARCH="x64"
else
    echo "❌ Unsupported architecture: $(uname -m)"
    exit 1
fi

echo "🖥️  Detected: $OS $ARCH"
echo ""

# Download and run appropriate installer
INSTALLER_URL="https://raw.githubusercontent.com/phyter1/claude-agents-installer/main/scripts/install-${OS}-${ARCH}.sh"

echo "📥 Downloading installer..."
curl -fsSL "$INSTALLER_URL" | bash

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Installation failed"
    echo "Try downloading directly from:"
    echo "  $INSTALLER_URL"
    exit 1
fi
UNIVERSAL_INSTALLER

chmod +x scripts/install.sh
echo "✅ Created universal installer: scripts/install.sh"

# Create Windows PowerShell installer
echo ""
echo "📦 Creating Windows PowerShell installer..."

cat > scripts/install-windows.ps1 << 'WINDOWS_INSTALLER'
# Claude Agents Installer for Windows
# Run with: powershell -ExecutionPolicy Bypass -File install-windows.ps1

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "     Claude Agents Installer (Windows)" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

# Download URL
$downloadUrl = "https://github.com/phyter1/claude-agents-installer/releases/latest/download/claude-agents-windows-x64.exe"
$installDir = "$env:LOCALAPPDATA\Programs\claude-agents"
$exePath = "$installDir\claude-agents.exe"

try {
    Write-Host "📥 Downloading Claude Agents CLI..." -ForegroundColor Yellow
    
    # Create installation directory
    New-Item -ItemType Directory -Path $installDir -Force | Out-Null
    
    # Download the executable
    Invoke-WebRequest -Uri $downloadUrl -OutFile $exePath
    
    Write-Host "✅ Download successful!" -ForegroundColor Green
    
    # Add to PATH
    $currentPath = [Environment]::GetEnvironmentVariable("Path", [EnvironmentVariableTarget]::User)
    if ($currentPath -notlike "*$installDir*") {
        Write-Host "📝 Adding to PATH..." -ForegroundColor Yellow
        $newPath = "$currentPath;$installDir"
        [Environment]::SetEnvironmentVariable("Path", $newPath, [EnvironmentVariableTarget]::User)
        $env:Path = "$env:Path;$installDir"
        Write-Host "✅ PATH updated!" -ForegroundColor Green
    }
    
    Write-Host ""
    Write-Host "✅ Claude Agents CLI successfully installed!" -ForegroundColor Green
    Write-Host "📝 Restart your terminal and run:" -ForegroundColor Cyan
    Write-Host "  claude-agents --help"
    Write-Host "  claude-agents install all"
    Write-Host ""
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
    
} catch {
    Write-Host "❌ Installation failed: $_" -ForegroundColor Red
    exit 1
}
WINDOWS_INSTALLER

echo "✅ Created Windows installer: scripts/install-windows.ps1"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Installer generation complete!"
echo ""
echo "📦 Generated installers:"
echo "  • scripts/install.sh          - Universal installer"
echo "  • scripts/install-macos-arm64.sh"
echo "  • scripts/install-macos-x64.sh"
echo "  • scripts/install-linux-x64.sh"
echo "  • scripts/install-linux-arm64.sh"
echo "  • scripts/install-windows.ps1"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
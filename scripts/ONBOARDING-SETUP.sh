#!/bin/bash
# ONBOARDING-SETUP.sh for BondMCP Model Context Protocol
# Version: 1.0
# Last updated: 2025-06-09

set -e

# === Constants ===
SETUP_LOG="setup.log"
PYTHON_MIN_VERSION="3.8"
NODE_MIN_VERSION="16"

# Create log file
: > "$SETUP_LOG"

log() {
  echo "[LOG] $1" | tee -a "$SETUP_LOG"
}

fail() {
  echo "[ERROR] ❌ $1" | tee -a "$SETUP_LOG"
  exit 1
}

command_exists() {
  command -v "$1" >/dev/null 2>&1
}

log "🚀 Starting BondMCP SDK Setup..."

# === Check system requirements ===
log "Checking system requirements..."

# Python version check
if ! command_exists python3; then
  fail "Python 3 is required but not installed"
fi

PYTHON_VERSION=$(python3 -c 'import sys; print(".".join(map(str, sys.version_info[:2])))')
PYTHON_MAJOR=$(echo $PYTHON_VERSION | cut -d. -f1)
PYTHON_MINOR=$(echo $PYTHON_VERSION | cut -d. -f2)
REQUIRED_MAJOR=$(echo $PYTHON_MIN_VERSION | cut -d. -f1)
REQUIRED_MINOR=$(echo $PYTHON_MIN_VERSION | cut -d. -f2)

if [ "$PYTHON_MAJOR" -lt "$REQUIRED_MAJOR" ] || ([ "$PYTHON_MAJOR" -eq "$REQUIRED_MAJOR" ] && [ "$PYTHON_MINOR" -lt "$REQUIRED_MINOR" ]); then
  fail "Python $PYTHON_MIN_VERSION+ is required, but found $PYTHON_VERSION"
fi
log "✓ Python $PYTHON_VERSION detected"

# Node.js version check
if command_exists node; then
  NODE_VERSION=$(node -v | cut -d'v' -f2)
  NODE_MAJOR=$(echo $NODE_VERSION | cut -d. -f1)
  REQUIRED_NODE_MAJOR=$(echo $NODE_MIN_VERSION | cut -d. -f1)
  
  if [ "$NODE_MAJOR" -lt "$REQUIRED_NODE_MAJOR" ]; then
    log "⚠️ Node.js $NODE_MIN_VERSION+ is recommended, but found $NODE_VERSION"
  else
    log "✓ Node.js $NODE_VERSION detected"
  fi
else
  log "⚠️ Node.js not found. TypeScript SDK requires Node.js $NODE_MIN_VERSION+"
fi

# === Environment setup ===
log "Setting up environment..."

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
  log "Creating .env file from example..."
  cp .env.example .env
  log "✓ Created .env file. Please update it with your API credentials."
else
  log "✓ .env file already exists"
fi

# === Python SDK setup ===
log "Setting up Python SDK..."

# Create virtual environment
if [ ! -d "venv" ]; then
  log "Creating Python virtual environment..."
  python3 -m venv venv
  log "✓ Created virtual environment"
else
  log "✓ Virtual environment already exists"
fi

# Activate virtual environment and install dependencies
log "Installing Python dependencies..."
source venv/bin/activate
pip install -e .
log "✓ Installed Python SDK and dependencies"

# Run verification script
log "Verifying Python SDK installation..."
python verify_installation.py
log "✓ Python SDK verification complete"

# === TypeScript SDK setup ===
if command_exists npm; then
  log "Setting up TypeScript SDK..."
  
  # Install TypeScript SDK dependencies
  log "Installing TypeScript dependencies..."
  npm install
  log "✓ Installed TypeScript dependencies"
else
  log "⚠️ Skipping TypeScript SDK setup (npm not found)"
fi

# === Final steps ===
log "✅ BondMCP SDK setup complete!"
log ""
log "Next steps:"
log "1. Update your .env file with your API credentials"
log "2. Check the README.md for usage examples"
log "3. Explore the examples directory for sample code"
log ""
log "For more information, visit: https://docs.bondmcp.com"

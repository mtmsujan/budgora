#!/bin/bash

# Quick script to test React Native app on Android Emulator

set -e

echo "🚀 Quick Android Test Script"
echo "============================"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the BudgoraMobile directory"
    exit 1
fi

# Check if Java is installed
if ! command -v java &> /dev/null; then
    echo "❌ Java not found. Please install JDK 17+"
    echo "   Run: brew install openjdk@17"
    exit 1
fi

# Check if Android SDK is set
if [ -z "$ANDROID_HOME" ]; then
    echo "⚠️  ANDROID_HOME not set. Setting default location..."
    export ANDROID_HOME=$HOME/Library/Android/sdk
    export PATH=$PATH:$ANDROID_HOME/platform-tools
    export PATH=$PATH:$ANDROID_HOME/emulator
fi

# Check if adb is available
if ! command -v adb &> /dev/null; then
    echo "❌ ADB not found. Please install Android SDK"
    echo "   Install Android Studio and set ANDROID_HOME"
    exit 1
fi

# Check if emulator is running
echo "📱 Checking for running emulators..."
DEVICES=$(adb devices | grep -v "List" | grep "device$" | wc -l | tr -d ' ')

if [ "$DEVICES" -eq 0 ]; then
    echo "⚠️  No Android emulator detected!"
    echo ""
    echo "Please start an emulator:"
    echo "  1. Open Android Studio"
    echo "  2. Tools → Device Manager"
    echo "  3. Click Play button next to an AVD"
    echo ""
    echo "Or from command line:"
    echo "  emulator -avd <AVD_NAME>"
    echo ""
    read -p "Press Enter after starting the emulator, or Ctrl+C to cancel..."
    
    # Check again
    DEVICES=$(adb devices | grep -v "List" | grep "device$" | wc -l | tr -d ' ')
    if [ "$DEVICES" -eq 0 ]; then
        echo "❌ Still no emulator found. Exiting."
        exit 1
    fi
fi

echo "✅ Emulator detected!"
echo ""

# Check if Metro is running
echo "📦 Checking Metro bundler..."
if ! lsof -Pi :8081 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "⚠️  Metro bundler not running. Starting it..."
    echo "   (Keep this terminal open and Metro will run in background)"
    npm start &
    METRO_PID=$!
    sleep 5
    echo "✅ Metro bundler started (PID: $METRO_PID)"
else
    echo "✅ Metro bundler is already running"
fi

echo ""
echo "🔨 Building and installing app..."
echo ""

# Run Android app
npm run android

echo ""
echo "✅ Done! The app should now be running on your Android emulator."
echo ""
echo "💡 Tips:"
echo "  - Press 'R' twice in Metro bundler to reload"
echo "  - Press 'M' to open developer menu in emulator"
echo "  - Shake device (Cmd+M) to open dev menu"
echo ""




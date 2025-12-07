#!/bin/bash

# Script to fix Android PATH and run the app

echo "🔧 Fixing Android PATH and running app"
echo "====================================="

# Set Android environment variables
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/emulator

echo "✅ Android environment variables set:"
echo "   ANDROID_HOME=$ANDROID_HOME"
echo ""

# Check if adb is now available
if command -v adb &> /dev/null; then
    echo "✅ ADB found:"
    adb version | head -1
    echo ""
else
    echo "❌ ADB still not found. Please check your Android SDK installation."
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

# Run Android app with explicit PATH
PATH=$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator npm run android

echo ""
echo "✅ Done! The app should now be running on your Android emulator."
echo ""
echo "💡 Tips:"
echo "  - Press 'R' twice in Metro bundler to reload"
echo "  - Press 'M' to open developer menu in emulator"
echo "  - Shake device (Cmd+M) to open dev menu"
echo ""

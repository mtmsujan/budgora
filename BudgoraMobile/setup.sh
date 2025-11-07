#!/bin/bash

# Budgora React Native Setup Script

echo "🚀 Setting up Budgora React Native project..."

# Check if CocoaPods is installed
if ! command -v pod &> /dev/null; then
    echo "❌ CocoaPods is not installed."
    echo ""
    echo "Installing CocoaPods..."
    
    # Try to install via gem
    if command -v gem &> /dev/null; then
        echo "Installing CocoaPods via gem..."
        sudo gem install cocoapods
    else
        echo "⚠️  gem not found. Please install Ruby first, or use Homebrew:"
        echo "   brew install cocoapods"
        exit 1
    fi
fi

echo "✅ CocoaPods is installed"

# Install iOS dependencies
if [ -d "ios" ]; then
    echo "📦 Installing iOS dependencies..."
    cd ios
    pod install
    cd ..
    echo "✅ iOS dependencies installed"
else
    echo "⚠️  iOS directory not found"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. npm start          # Start Metro bundler"
echo "  2. npm run ios        # Run on iOS"
echo "  3. npm run android    # Run on Android"



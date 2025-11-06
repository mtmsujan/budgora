#!/bin/bash

echo "🚀 Setting up Budgora Mobile App with Expo..."

# Create Expo project
echo "📦 Creating Expo project..."
npx create-expo-app BudgoraMobile --template blank-typescript

# Copy files
echo "📋 Copying application files..."
cd BudgoraMobile
cp -r ../mobile-app/src .
cp ../mobile-app/App.tsx .
cp ../mobile-app/package.json .
cp ../mobile-app/app.json .
cp ../mobile-app/babel.config.js .
cp ../mobile-app/index.js .

# Install dependencies
echo "📥 Installing dependencies..."
npm install

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Edit src/services/apiClient.ts and update API_BASE_URL"
echo "2. Start your Laravel backend: php artisan serve"
echo "3. Run: npm start"
echo ""
echo "💡 For iOS Simulator: Use http://localhost:8000/api/v1"
echo "💡 For Android Emulator: Use http://10.0.2.2:8000/api/v1"
echo "💡 For Physical Device: Use http://YOUR_IP:8000/api/v1"

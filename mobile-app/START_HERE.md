# 📱 Expo Setup Complete!

All files have been updated for Expo. Here's how to get started:

## 🚀 Quick Setup (3 Commands)

```bash
# 1. Create Expo project
cd /Users/mdtoriqulmowla/Herd/budgora
npx create-expo-app BudgoraMobile --template blank-typescript

# 2. Copy files
cd BudgoraMobile
cp -r ../mobile-app/src .
cp ../mobile-app/App.tsx .
cp ../mobile-app/package.json .
cp ../mobile-app/app.json .
cp ../mobile-app/babel.config.js .
cp ../mobile-app/index.js .
cp ../mobile-app/tsconfig.json .

# 3. Install dependencies
npm install
```

## ⚙️ Configure API URL

**IMPORTANT:** Edit `src/services/apiClient.ts` before running:

**For iOS Simulator:**
```typescript
const API_BASE_URL = 'http://localhost:8000/api/v1';
```

**For Android Emulator:**
```typescript
const API_BASE_URL = 'http://10.0.2.2:8000/api/v1';
```

**For Physical Device:**
```typescript
// Find your IP: ifconfig (Mac) or ipconfig (Windows)
const API_BASE_URL = 'http://192.168.1.XXX:8000/api/v1';
```

## ▶️ Run the App

```bash
# Make sure Laravel backend is running first
cd /Users/mdtoriqulmowla/Herd/budgora
php artisan serve

# Then in another terminal:
cd BudgoraMobile
npm start
```

Then press:
- `i` for iOS Simulator
- `a` for Android Emulator
- Scan QR code with Expo Go app

## ✅ What's Configured

- ✅ Expo package.json with all dependencies
- ✅ Expo app.json configuration
- ✅ Babel config for Expo
- ✅ TypeScript config
- ✅ App.tsx with Expo StatusBar
- ✅ Index.js using Expo's registerRootComponent
- ✅ All screens and services ready

## 📝 Test Credentials

- Email: `admin@mail.com`
- Password: `12345678`

## 🎉 You're Ready!

Run the setup commands above and you'll have a working Expo app!




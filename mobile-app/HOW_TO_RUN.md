# 🚀 Running Budgora App in iOS Simulator

## Step-by-Step Instructions

### Step 1: Make sure Laravel Backend is Running

Open a terminal and run:
```bash
cd /Users/mdtoriqulmowla/Herd/budgora
php artisan serve
```

You should see: `Laravel development server started: http://127.0.0.1:8000`

### Step 2: Start Expo and Open iOS Simulator

In another terminal, run:
```bash
cd /Users/mdtoriqulmowla/Herd/budgora/BudgoraMobile
npx expo start --ios
```

This will:
- ✅ Start Expo development server
- ✅ Automatically open iOS Simulator
- ✅ Build and install your app
- ✅ Launch the app on the simulator

### Alternative: If Expo is Already Running

If you see the Expo QR code/menu in your terminal:
1. **Press `i`** on your keyboard
2. This will open iOS Simulator and launch the app

### Step 3: Wait for the App to Load

You should see:
1. iOS Simulator window opens (iPhone screen)
2. Expo builds your app
3. App installs on simulator
4. **Budgora login screen appears**

### Step 4: Login

Use these credentials:
- **Email:** `admin@mail.com`
- **Password:** `12345678`

## 📱 If iOS Simulator Doesn't Open Automatically

### Option A: Open Simulator Manually

1. Open **Xcode**
2. Go to **Xcode > Open Developer Tool > Simulator**
3. Or press `Cmd + Space` and search for "Simulator"
4. Once Simulator is open, in Expo terminal press `i`

### Option B: Use Expo Go App (On Your iPhone)

1. Install **Expo Go** app from App Store on your iPhone
2. Make sure your iPhone and Mac are on the same WiFi network
3. In Expo terminal, press `s` to show QR code
4. Scan QR code with Expo Go app

## 🔧 Troubleshooting

### "Cannot connect to Expo"
- Make sure Expo server is running
- Check your internet connection
- Try: `npm start -- --clear`

### "Network request failed"
- Make sure Laravel backend is running (`php artisan serve`)
- Check API URL in `src/services/apiClient.ts`
- For iOS Simulator: Use `http://localhost:8000/api/v1`

### Simulator is Slow
- Close other apps
- Restart Simulator
- Use a smaller device (iPhone SE instead of iPhone Pro Max)

### App Won't Build
- Make sure all dependencies are installed: `npm install`
- Check for errors in terminal
- Try: `npm start -- --clear`

## ✅ Expected Result

You should see:
1. iOS Simulator window with iPhone
2. Expo development menu at bottom
3. Budgora app opens showing login screen
4. You can login and use the app!

## 🎯 Quick Command Reference

```bash
# Start Expo with iOS Simulator (all-in-one)
cd BudgoraMobile
npx expo start --ios

# Start Expo only (then press 'i')
cd BudgoraMobile
npm start

# Clear cache and restart
cd BudgoraMobile
npm start -- --clear
```

The app should now be visible in your iOS Simulator! 📱




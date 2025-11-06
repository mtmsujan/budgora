# How to Run Budgora App in iOS Simulator

## Method 1: Using Expo CLI (Easiest)

If Expo is already running, just press `i` in the terminal where Expo is running.

Or run:
```bash
cd BudgoraMobile
npm start -- --ios
```

## Method 2: Open iOS Simulator Manually

1. **Open iOS Simulator:**
   ```bash
   open -a Simulator
   ```
   
   Or find it in Applications > Xcode > Open Developer Tool > Simulator

2. **Wait for Simulator to load** (iPhone will appear)

3. **In the Expo terminal**, press `i` to launch the app in the simulator

## Method 3: Direct Launch

```bash
cd BudgoraMobile
npx expo start --ios
```

This will automatically:
- Start Expo server
- Open iOS Simulator
- Install and launch your app

## Troubleshooting

### If Simulator doesn't open:
- Make sure Xcode is installed: `xcode-select --install`
- Check if Simulator is installed: `xcrun simctl list devices`

### If app doesn't load:
- Make sure Laravel backend is running: `php artisan serve`
- Check API URL in `src/services/apiClient.ts` is `http://localhost:8000/api/v1`
- Check Expo terminal for any errors

### If you see "Unable to connect":
- Make sure both Expo and Laravel are running
- Check firewall settings
- Try restarting Expo: `npm start -- --clear`

## Quick Commands

```bash
# Start Expo with iOS Simulator
cd BudgoraMobile
npm start -- --ios

# Or just start Expo and press 'i'
npm start
# Then press 'i' when prompted
```

## What You Should See

1. Expo development server starts
2. iOS Simulator opens automatically
3. App builds and installs on simulator
4. Budgora login screen appears

Then you can login with:
- Email: `admin@mail.com`
- Password: `12345678`




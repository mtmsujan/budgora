# Expo Setup Instructions

## 🎯 One-Command Setup Script

Run this in your terminal:

```bash
cd /Users/mdtoriqulmowla/Herd/budgora && \
npx create-expo-app BudgoraMobile --template blank-typescript && \
cd BudgoraMobile && \
cp -r ../mobile-app/src . && \
cp ../mobile-app/App.tsx . && \
cp ../mobile-app/package.json . && \
cp ../mobile-app/app.json . && \
cp ../mobile-app/babel.config.js . && \
cp ../mobile-app/index.js . && \
npm install && \
echo "✅ Setup complete! Now edit src/services/apiClient.ts with your API URL and run: npm start"
```

## 📝 Manual Setup Steps

### 1. Create Expo Project
```bash
npx create-expo-app BudgoraMobile --template blank-typescript
cd BudgoraMobile
```

### 2. Copy Files
```bash
cp -r ../mobile-app/src .
cp ../mobile-app/App.tsx .
cp ../mobile-app/package.json .
cp ../mobile-app/app.json .
cp ../mobile-app/babel.config.js .
cp ../mobile-app/index.js .
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure API URL
Edit `src/services/apiClient.ts`:
- Change `API_BASE_URL` to your backend URL
- See SETUP_COMPLETE.md for IP address options

### 5. Start Development
```bash
npm start
```

Then press:
- `i` for iOS Simulator
- `a` for Android Emulator
- Scan QR code for Expo Go app

## ✅ Verification Checklist

- [ ] Expo project created
- [ ] All files copied
- [ ] Dependencies installed
- [ ] API URL configured
- [ ] Laravel backend running on port 8000
- [ ] Can connect to API from app

## 🐛 Common Issues

**Issue:** Can't connect to API
- **Solution:** Check IP address and update `apiClient.ts`

**Issue:** Module not found errors
- **Solution:** Run `npm install` again

**Issue:** Expo Go can't connect
- **Solution:** Make sure phone and computer are on same WiFi network

## 📱 Testing

Login with:
- Email: `admin@mail.com`
- Password: `12345678`




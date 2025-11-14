# Mobile App Setup Guide

## Android & iOS Folders

The Android and iOS native project folders (`android/` and `ios/`) are **automatically generated** by Expo when you build or run the app. They are not included in the repository by default.

### To Generate Native Folders

1. **Install Expo CLI** (if not already installed):
```bash
npm install -g expo-cli
```

2. **Generate Android folder**:
```bash
cd apps/mobile
npx expo prebuild --platform android
```

3. **Generate iOS folder** (Mac only):
```bash
npx expo prebuild --platform ios
```

### Running the App

#### Development Mode (Recommended)
Expo handles everything automatically without needing native folders:
```bash
npm start
# Then press 'a' for Android or 'i' for iOS
```

#### With Native Folders
After generating native folders, you can run:
```bash
# Android
npm run android

# iOS (Mac only)
npm run ios
```

### Building for Production

#### Using EAS Build (Recommended)
```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios
```

#### Using Native Folders
After generating native folders:
- **Android**: Open `android/` folder in Android Studio and build
- **iOS**: Open `ios/` folder in Xcode and build

## Project Structure

```
apps/mobile/
├── app/              # React Native screens (Expo Router)
├── components/       # Reusable components
├── lib/             # Utilities and data
├── assets/          # Images, fonts, etc.
├── android/         # Generated - Android native code
├── ios/             # Generated - iOS native code
└── package.json
```

## Important Notes

- The `android/` and `ios/` folders are gitignored by default
- They are regenerated from `app.json` configuration when needed
- All app logic is in the `app/` folder using React Native
- Native code modifications should be done through Expo config plugins when possible


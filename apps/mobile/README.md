# Zuka Mobile App

React Native mobile application for Zuka e-commerce platform, built with Expo and React Native.

## Features

- 🏠 **Home Screen** - Hero carousel, categories, featured products
- 🛍️ **Shop** - Browse products with filters and search
- 🎮 **Games** - Play games to earn Royale points
- ❤️ **Wishlist** - Save your favorite products
- 👤 **Profile** - Manage account and view rewards
- 🛒 **Cart** - Shopping cart with checkout
- 📱 **Product Details** - Detailed product pages

## Tech Stack

- **React Native** - Mobile framework
- **Expo** - Development platform
- **TypeScript** - Type safety
- **Expo Router** - File-based routing
- **React Navigation** - Navigation library
- **Expo Linear Gradient** - Gradient components
- **Zustand** - State management

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator

### Installation

1. Install dependencies:
```bash
cd apps/mobile
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on iOS:
```bash
npm run ios
```

4. Run on Android:
```bash
npm run android
```

## Project Structure

```
apps/mobile/
├── app/                 # App screens (Expo Router)
│   ├── (tabs)/          # Tab navigation screens
│   │   ├── index.tsx    # Home screen
│   │   ├── shop.tsx     # Shop screen
│   │   ├── games.tsx    # Games screen
│   │   ├── wishlist.tsx # Wishlist screen
│   │   └── profile.tsx  # Profile screen
│   ├── shop/[slug].tsx  # Product detail page
│   └── cart.tsx         # Cart screen
├── components/          # Reusable components
│   ├── Navbar.tsx
│   ├── ProductCard.tsx
│   └── ValueProps.tsx
├── lib/                 # Utilities and data
│   ├── catalog.ts       # Product catalog
│   └── utils.ts         # Helper functions
└── package.json
```

## Design System

The app uses the same brand colors as the website:

- **Primary Purple**: `#570a70`
- **Gold**: `#e49b09`
- **Feminine Pink**: `#e246a4`
- **Masculine Dark**: `#3d074e`

## Building for Production

### Android

```bash
eas build --platform android
```

### iOS

```bash
eas build --platform ios
```

## Development Notes

- The app uses Expo Router for file-based routing
- Components are designed to match the website's look and feel
- Product data is shared from the catalog library
- Navigation uses React Navigation under the hood

## License

Private - Zuka E-commerce Platform


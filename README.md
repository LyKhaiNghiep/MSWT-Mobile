# MSWT Mobile

A modern React Native mobile application built with Expo and TypeScript.

## 🚀 Getting Started

### Prerequisites

- Node.js (>=18)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Expo Go app on your mobile device (for testing)

### Installation

1. Clone the repository:

   ```bash
   git clone <your-repository-url>
   cd MSWT-Mobile
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm start
   ```

4. Scan the QR code with Expo Go app to run the app on your device.

## 📱 Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm run web` - Run in web browser
- `npm run lint` - Run ESLint to check code quality
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check if code is properly formatted
- `npm run type-check` - Run TypeScript type checking

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
├── screens/            # Screen components
├── navigation/         # Navigation configuration
├── hooks/             # Custom React hooks
├── utils/             # Helper functions
├── types/             # TypeScript type definitions
├── constants/         # App constants (colors, spacing, etc.)
├── store/             # Redux store and slices
│   ├── slices/        # Redux slices (auth, user, etc.)
│   ├── hooks.ts       # Typed Redux hooks
│   └── index.ts       # Store configuration
├── api/               # API services and Axios configuration
└── services/          # Business logic and external integrations
```

## 🛠️ Technology Stack

- **React Native** - Mobile app framework
- **Expo** - Development platform and build service
- **TypeScript** - Type-safe JavaScript
- **Redux Toolkit** - State management with modern Redux
- **React Redux** - Redux bindings for React
- **Axios** - HTTP client for API calls
- **React Navigation** - Navigation library
- **AsyncStorage** - Local storage solution
- **ESLint + Prettier** - Code linting and formatting

## 📋 Features

- ✅ TypeScript configuration
- ✅ ESLint and Prettier setup
- ✅ Project structure with organized folders
- ✅ Redux Toolkit state management
- ✅ Axios API client with interceptors
- ✅ Authentication flow with Redux
- ✅ Custom components and hooks
- ✅ Constants for colors, spacing, and typography
- ✅ Utility functions
- ✅ AsyncStorage integration
- ✅ Type definitions
- ✅ Storage service for token persistence

## 🎨 Design System

The app includes a basic design system with:

- **Colors**: Primary, secondary, accent colors with dark mode support
- **Typography**: Consistent font sizes and weights
- **Spacing**: Standardized spacing values
- **Components**: Reusable Button component with variants

## 📦 Additional Libraries to Consider

For further development, consider adding:

- **State Management**: Redux Toolkit, Zustand, or Context API
- **Forms**: React Hook Form
- **UI Library**: NativeBase, UI Kitten, or React Native Elements
- **Icons**: React Native Vector Icons
- **Animation**: React Native Reanimated
- **Testing**: Jest, React Native Testing Library
- **API Client**: Axios or React Query

## 🔧 Development Guidelines

1. Use TypeScript for all new files
2. Follow the established folder structure
3. Use the provided design system constants
4. Write reusable components in the `components` folder
5. Keep business logic in custom hooks
6. Use ESLint and Prettier for code consistency

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

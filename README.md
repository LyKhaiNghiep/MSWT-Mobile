## How to run the project?

1. clone the repo
2. npm install --global yarn
3. yarn install
4. open Android Studio, go to SDK Manager and install andoid sdk 34
5. open Virtual Device Manager and create a new device with API 34
6. npx react-native doctor
7. enter `a` for automatic fix
8. connect to your virtual device
9. yarn start
10. enter `a` for running on android

## Tech Stack 🔨

- React Native
- TypeScript
- **Navigation**

  - Bottom tabs
  - Native Stack

- **Design & UI**
  - Restyle
  - Linear Gradient
  - Bottom Sheet
  - Super Grid
  - Vision Camera
  - Skia
  - Flash Calendar
  - Flash List
  - Lottie
  - Calendar Strip
  - Reanimated
  - Fast Image

cd android
.\gradlew --stop
rd /s /q .\app\build
.\gradlew clean

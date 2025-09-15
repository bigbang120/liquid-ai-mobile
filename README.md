# liquid-ai-mobile

This repository contains a React Native (Expo) app skeleton for the Liquid AI project. It provides the basic navigation structure and placeholder screens for key features such as onboarding, health dashboards, biomarker trends, emergency assistance, household and pet management, predictive timelines, and insurance integration.

## Getting Started

1. **Clone the repository and install dependencies:**

   ```sh
   git clone https://github.com/<your-username>/liquid-ai-mobile.git
   cd liquid-ai-mobile
   npm install
   # or use yarn if you prefer
   ```

2. **Start the Expo development server:**

   ```sh
   npx expo start
   ```

   This will launch Expo DevTools in your browser. From there you can run the app on an iOS Simulator, Android emulator, or a physical device via the Expo Go app.

3. **Configure Firebase:** Replace the configuration values in [`firebase.js`](firebase.js) with your own Firebase project credentials:

   ```js
   const firebaseConfig = {
     apiKey: "<YOUR_API_KEY>",
     authDomain: "<YOUR_AUTH_DOMAIN>",
     projectId: "<YOUR_PROJECT_ID>",
     storageBucket: "<YOUR_STORAGE_BUCKET>",
     messagingSenderId: "<YOUR_MESSAGING_SENDER_ID>",
     appId: "<YOUR_APP_ID>"
   };
   ```

   Without valid Firebase credentials, authentication and database functionality will not work.

## Project Structure

- `App.js` – Registers the navigation stack and defines the routes for each screen.
- `firebase.js` – Firebase initialization. Update this with your Firebase configuration.
- `screens/` – Contains individual screen components:
  - `OnboardingScreen.js`
  - `HumanDashboardScreen.js`
  - `PetDashboardScreen.js`
  - `BiomarkerTrendsScreen.js`
  - `FatalityAlertScreen.js`
  - `EmergencyScreen.js`
  - `HealthTimelineScreen.js`
  - `PredictiveTimelineScreen.js`
  - `HouseholdDashboardScreen.js`
  - `InsuranceScreen.js`

Each screen currently displays placeholder text. You should extend these components to fetch real data from wearables, Firebase, or other APIs, and to implement the Liquid AI predictive logic.

## Next Steps

- **Integrate wearables & sensors:** Add APIs or SDKs for devices such as Apple Watch, Fitbit, Dexcom, and pet trackers to pull health metrics into the app.
- **Implement backend logic:** Connect to Firebase (Authentication, Firestore or Realtime Database) and implement business logic for alerts, predictive analytics, and notifications.
- **Polish the UI:** Replace placeholder content with dynamic components (charts, lists, forms) and refine the user experience.
- **Add authentication flows:** Implement user sign-in/sign-up using Firebase Auth.

Feel free to fork and customize this project as needed to build a full-featured Liquid AI mobile application.

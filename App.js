import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import OnboardingScreen from './screens/OnboardingScreen';
import HumanDashboardScreen from './screens/HumanDashboardScreen';
import PetDashboardScreen from './screens/PetDashboardScreen';
import BiomarkerTrendsScreen from './screens/BiomarkerTrendsScreen';
import FatalityAlertScreen from './screens/FatalityAlertScreen';
import EmergencyScreen from './screens/EmergencyScreen';
import HealthTimelineScreen from './screens/HealthTimelineScreen';
import PredictiveTimelineScreen from './screens/PredictiveTimelineScreen';
import HouseholdDashboardScreen from './screens/HouseholdDashboardScreen';
import InsuranceScreen from './screens/InsuranceScreen';
import PredictScreen from './src/screens/PredictScreen';
import AlertsScreen from './src/screens/AlertsScreen';

const Stack = createNativeStackNavigator();

import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Onboarding">
        <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ title: 'Connect Device' }} />
        <Stack.Screen name="HumanDashboard" component={HumanDashboardScreen} options={{ title: 'Human Dashboard' }} />
        <Stack.Screen name="PetDashboard" component={PetDashboardScreen} options={{ title: 'Pet Dashboard' }} />
        <Stack.Screen name="Trends" component={BiomarkerTrendsScreen} options={{ title: 'Biomarker Trends' }} />
        <Stack.Screen name="Alert" component={FatalityAlertScreen} options={{ title: 'Fatality Alert' }} />
        <Stack.Screen name="Emergency" component={EmergencyScreen} options={{ title: 'Emergency Assistance' }} />
        <Stack.Screen name="Timeline" component={HealthTimelineScreen} options={{ title: 'Health Timeline' }} />
        <Stack.Screen name="PredictiveTimeline" component={PredictiveTimelineScreen} options={{ title: 'Predictive Timeline' }} />
        <Stack.Screen name="Household" component={HouseholdDashboardScreen} options={{ title: 'Household Dashboard' }} />
        <Stack.Screen name="Insurance" component={InsuranceScreen} options={{ title: 'Insurance Integration' }} />
          <Stack.Screen name="Predict" component={PredictScreen} options={{ title: 'Predict' }} />
        <Stack.Screen name="Alerts" component={AlertsScreen} options={{ title: 'Alerts' }} />
        <Stack.Screen name="Analytics" component={require('./src/screens/AnalyticsScreen').default} options={{ title: 'Analytics' }} />
        <Stack.Screen name="Notifications" component={require('./src/screens/NotificationsScreen').default} options={{ title: 'Notifications' }} />
          <Stack.Screen name="Sensors" component={require('./src/screens/SensorsScreen').default} options={{ title: 'Sensors' }} />
  
  
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
      <Stack.Screen name="Signup" component={SignupScreen} options={{ title: 'Sign Up' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

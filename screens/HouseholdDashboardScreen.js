import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HouseholdDashboardScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Household Dashboard</Text>
      <Text style={styles.content}>
        This screen provides an overview of the health statuses of all connected household members and pets.
      </Text>
    </View>
  );
};

export default HouseholdDashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  content: {
    fontSize: 16,
    textAlign: 'center',
  },
});

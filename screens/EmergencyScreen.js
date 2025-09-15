import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const EmergencyScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Emergency Assistance</Text>
      <Text>If you're in danger, call emergency services.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
});

export default EmergencyScreen;

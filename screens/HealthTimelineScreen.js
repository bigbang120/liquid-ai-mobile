import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HealthTimelineScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Health Timeline</Text>
      <Text>Here we will display the user's health events over time.</Text>
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

export default HealthTimelineScreen;

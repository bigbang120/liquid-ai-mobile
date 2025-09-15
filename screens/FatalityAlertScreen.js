import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FatalityAlertScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fatality Alert</Text>
      <Text>No critical alerts at this time.</Text>
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

export default FatalityAlertScreen;

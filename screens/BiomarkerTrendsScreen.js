import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const BiomarkerTrendsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Biomarker Trends</Text>
      <Text>Charts and data will appear here.</Text>
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

export default BiomarkerTrendsScreen;

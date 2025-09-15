import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const InsuranceScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Insurance Integration</Text>
      <Text style={styles.content}>
        This screen will allow users to integrate their insurance plans and view premium savings or benefits based on health data.
      </Text>
    </View>
  );
};

export default InsuranceScreen;

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

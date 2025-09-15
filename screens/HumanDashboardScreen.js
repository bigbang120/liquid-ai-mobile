import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const HumanDashboardScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Human Dashboard</Text>
      <Button title="View Trends" onPress={() => navigation.navigate('Trends')} />
      <Button title="Emergency" onPress={() => navigation.navigate('Emergency')} />
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

export default HumanDashboardScreen;

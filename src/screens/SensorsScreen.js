import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Accelerometer, Pedometer } from 'expo-sensors';

export default function SensorsScreen() {
  const [accData, setAccData] = useState({ x: 0, y: 0, z: 0 });
  const [stepCount, setStepCount] = useState(0);
  const [pedometerAvailable, setPedometerAvailable] = useState('checking');

  useEffect(() => {
    // Accelerometer subscription
    const accSubscription = Accelerometer.addListener((data) => {
      setAccData(data);
    });
    Accelerometer.setUpdateInterval(1000);

    // Pedometer availability and step count
    Pedometer.isAvailableAsync().then(
      (result) => {
        setPedometerAvailable(result ? 'available' : 'unavailable');
      },
      () => setPedometerAvailable('unavailable')
    );

    const pedSubscription = Pedometer.watchStepCount((result) => {
      setStepCount(result.steps);
    });

    return () => {
      accSubscription && accSubscription.remove();
      pedSubscription && pedSubscription.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sensor Data</Text>
      <Text style={styles.sectionTitle}>Accelerometer</Text>
      <Text style={styles.text}>x: {accData.x.toFixed(2)} y: {accData.y.toFixed(2)} z: {accData.z.toFixed(2)}</Text>
      <Text style={styles.sectionTitle}>Pedometer</Text>
      <Text style={styles.text}>Availability: {pedometerAvailable}</Text>
      <Text style={styles.text}>Steps (since open): {stepCount}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  text: {
    fontSize: 16,
    marginTop: 4,
  },
});

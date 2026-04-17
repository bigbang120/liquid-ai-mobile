import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { sendReadings } from '../lib/api';

/**
 * Daily check‑in screen for Liquid AI consumer app.
 *
 * This screen collects simple vital sign inputs from the user (resting heart rate,
 * heart rate variability, SpO₂, and sleep hours) along with an optional note.
 * On submission it sends the data to the backend and navigates to the dashboard.
 */
export default function Input() {
  const router = useRouter();
  const [restingHeartRate, setRestingHeartRate] = useState('');
  const [hrv, setHrv] = useState('');
  const [spo2, setSpo2] = useState('');
  const [sleepHours, setSleepHours] = useState('');
  const [note, setNote] = useState('');

  const handleSubmit = async () => {
    const data = {
      user_id: 'user123', // temporary user id; replace with real user id once auth is in place
      resting_heart_rate: Number(restingHeartRate),
      hrv: Number(hrv),
      spo2: Number(spo2),
      sleep_hours: Number(sleepHours),
      note,
    };

    try {
      await sendReadings(data);
      // After submitting readings, navigate to the dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to send readings:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 16 }}>Daily Check‑In</Text>

      <Text>Resting Heart Rate</Text>
      <TextInput
        value={restingHeartRate}
        onChangeText={setRestingHeartRate}
        keyboardType="numeric"
        style={{ borderWidth: 1, borderColor: '#ccc', marginBottom: 12, padding: 8 }}
      />

      <Text>Heart Rate Variability (HRV)</Text>
      <TextInput
        value={hrv}
        onChangeText={setHrv}
        keyboardType="numeric"
        style={{ borderWidth: 1, borderColor: '#ccc', marginBottom: 12, padding: 8 }}
      />

      <Text>SpO₂ (%)</Text>
      <TextInput
        value={spo2}
        onChangeText={setSpo2}
        keyboardType="numeric"
        style={{ borderWidth: 1, borderColor: '#ccc', marginBottom: 12, padding: 8 }}
      />

      <Text>Sleep Hours</Text>
      <TextInput
        value={sleepHours}
        onChangeText={setSleepHours}
        keyboardType="numeric"
        style={{ borderWidth: 1, borderColor: '#ccc', marginBottom: 12, padding: 8 }}
      />

      <Text>Note (optional)</Text>
      <TextInput
        value={note}
        onChangeText={setNote}
        multiline
        style={{ borderWidth: 1, borderColor: '#ccc', marginBottom: 16, padding: 8 }}
      />

      <Button title="Submit" onPress={handleSubmit} />
    </ScrollView>
  );
}
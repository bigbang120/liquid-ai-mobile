
import React, { useState } from 'react';
import { SafeAreaView, Text, TextInput, Button, View, StyleSheet } from 'react-native';
import { savePrediction } from '../utils/storage';

// Replace YOUR_BACKEND with your backend URL
const BACKEND = 'http://YOUR_BACKEND:5000';

export default function PredictScreen() {
  const [species, setSpecies] = useState('human');
  const [heartRate, setHeartRate] = useState('');
  const [spo2, setSpo2] = useState('');
  const [temperature, setTemperature] = useState('');
  const [respRate, setRespRate] = useState('');
  const [rr, setRr] = useState('');
  const [result, setResult] = useState(null);

  const predict = async () => {
    try {
      const payload = {
        species,
        heart_rate: parseFloat(heartRate),
        spo2: parseFloat(spo2),
        temperature: parseFloat(temperature),
        resp_rate: parseFloat(respRate),
        rr: parseFloat(rr)
      };
      const res = await fetch(`${BACKEND}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      setResult(json);
          await savePrediction({
      species,
      heart_rate: parseFloat(heartRate),
      spo2: parseFloat(spo2),
      temperature: parseFloat(temperature),
      resp_rate: parseFloat(respRate),
      rr: parseFloat(rr),
      result: json,
      timestamp: Date.now(),
    })
    } catch (e) {
      console.log(e);
    }
      

  const getColor = () => {
    if (!result || result.tier == null) return '#52c41a'; // default green
    return result.tier === 2 ? '#ff4d4f' : result.tier === 1 ? '#ffa81a' : '#52c41a';
  };

  const getLabel = () => {
    if (!result || result.tier == null) return '';
    return result.tier === 2 ? 'CRITICAL' : result.tier === 1 ? 'WARNING' : 'OK';
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Predict Health Status</Text>
      <TextInput
        style={styles.input}
        placeholder="Species"
        value={species}
        onChangeText={setSpecies}
      />
      <TextInput
        style={styles.input}
        placeholder="Heart Rate"
        keyboardType="numeric"
        value={heartRate}
        onChangeText={setHeartRate}
      />
      <TextInput
        style={styles.input}
        placeholder="SpO2"
        keyboardType="numeric"
        value={spo2}
        onChangeText={setSpo2}
      />
      <TextInput
        style={styles.input}
        placeholder="Temperature"
        keyboardType="numeric"
        value={temperature}
        onChangeText={setTemperature}
      />
      <TextInput
        style={styles.input}
        placeholder="Respiratory Rate"
        keyboardType="numeric"
        value={respRate}
        onChangeText={setRespRate}
      />
      <TextInput
        style={styles.input}
        placeholder="RR Interval"
        keyboardType="numeric"
        value={rr}
        onChangeText={setRr}
      />
      <Button title="Predict" onPress={predict} />
      {result && (
        <View style={[styles.resultContainer, { backgroundColor: getColor() }]}> 
          <Text style={styles.resultText}>{getLabel()}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 12
  },
  resultContainer: {
    marginTop: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center'
  },
  resultText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  }
});

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { collection, , where, orderBy, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../../firebase';

export default function DashboardScreen() {
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    const uid = auth.currentUser ? auth.currentUser.uid : null;
    if (!uid) return;

    const q = query(
      collection(db, 'predictions'),
      where('uid', '==', uid),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPredictions(data);
    });

    return unsubscribe;
  }, []);

  const getLabel = (tier) => {
    if (tier === 2) return 'CRITICAL';
    if (tier === 1) return 'WARNING';
    return 'OK';
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.date}>{new Date(item.timestamp.seconds * 1000).toLocaleString()}</Text>
      <Text>Species: {item.species}</Text>
      <Text>Heart Rate: {item.heart_rate}</Text>
      <Text>SpO2: {item.spo2}</Text>
      <Text>Temperature: {item.temperature}</Text>
      <Text>Resp Rate: {item.resp_rate}</Text>
      <Text>RR: {item.rr}</Text>
      <Text style={{ color: item.result.tier === 2 ? 'red' : item.result.tier === 1 ? 'orange' : 'green' }}>
        Result: {getLabel(item.result.tier)}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Prediction History</Text>
      <FlatList
        data={predictions}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  date: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
});

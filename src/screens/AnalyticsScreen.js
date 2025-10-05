import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { auth, db } from '../../firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';

export default function AnalyticsScreen() {
  const [chartData, setChartData] = useState({ labels: [], datasets: [{ data: [] }] });

  useEffect(() => {
    const uid = auth.currentUser ? auth.currentUser.uid : null;
    if (!uid) return;

    const predictionsRef = collection(db, 'predictions');
    const q = query(predictionsRef, where('uid', '==', uid), orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const labels = [];
      const data = [];
      snapshot.forEach((doc) => {
        const item = doc.data();
        const ts = item.timestamp;
        let date;
        if (ts && typeof ts.toDate === 'function') {
          date = ts.toDate();
        } else {
          date = new Date();
        }
        const label = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + '\n' + date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
        labels.push(label);
        data.push(item.heart_rate);
      });
      // reverse to chronological order (oldest first)
      setChartData({
        labels: labels.reverse(),
        datasets: [
          {
            data: data.reverse(),
            color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
            strokeWidth: 2,
          },
        ],
      });
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Heart Rate Trends</Text>
      {chartData.labels.length > 0 ? (
        <LineChart
          data={chartData}
          width={Dimensions.get('window').width - 32}
          height={220}
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '3',
              strokeWidth: '1',
              stroke: '#007bff',
            },
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      ) : (
        <Text>No data available</Text>
      )}
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
    textAlign: 'center',
  },
});

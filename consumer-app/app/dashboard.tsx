import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { getDashboard } from '../lib/api';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getDashboard('user123');
        setData(res);
      } catch (error) {
        console.error('Failed to fetch dashboard', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!data) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No data available.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>
        Today's Status: {data.today_status}
      </Text>
      {data.headline && (
        <Text style={{ marginBottom: 10 }}>{data.headline}</Text>
      )}
      <Text style={{ fontSize: 18, marginBottom: 5 }}>Signals:</Text>
      {Object.keys(data.signals).map((key) => {
        const s = data.signals[key];
        return (
          <View key={key} style={{ marginBottom: 10 }}>
            <Text style={{ fontWeight: 'bold' }}>{key}</Text>
            <Text>Baseline: {s.baseline}</Text>
            <Text>Current: {s.current}</Text>
            <Text>Status: {s.status}</Text>
          </View>
        );
      })}
      <Text style={{ fontSize: 18, marginBottom: 5 }}>Alerts:</Text>
      {data.alerts && data.alerts.length > 0 ? (
        data.alerts.map((alert, idx) => (
          <View key={idx} style={{ marginBottom: 10 }}>
            <Text style={{ fontWeight: 'bold' }}>
              {alert.title} ({alert.severity})
            </Text>
            <Text>{alert.detail}</Text>
          </View>
        ))
      ) : (
        <Text>No alerts.</Text>
      )}
    </ScrollView>
  );
}

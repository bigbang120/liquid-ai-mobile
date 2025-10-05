import React, { useEffect, useState } from 'react';
import { SafeAreaView, FlatList, View, Text, StyleSheet } from 'react-native';

// Replace YOUR_BACKEND with your backend URL
const BACKEND = 'http://YOUR_BACKEND:5000';

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState([]);

  const fetchAlerts = async () => {
    try {
      const res = await fetch(`${BACKEND}/alerts`);
      const json = await res.json();
      setAlerts(json);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 5000);
    return () => clearInterval(interval);
  }, []);

  const getColor = (tier) => {
    return tier === 2 ? '#ff4d4f' : tier === 1 ? '#ffa81a' : '#52c41a';
  };

  const renderItem = ({ item }) => (
    <View style={[styles.alertBox, { borderLeftColor: getColor(item.tier) }]}> 
      <Text style={styles.alertTitle}>{item.message}</Text>
      <Text style={styles.alertTimestamp}>{item.timestamp}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={alerts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  alertBox: {
    borderLeftWidth: 8,
    padding: 12,
    backgroundColor: '#fefefe',
    marginBottom: 12,
    borderRadius: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  alertTimestamp: {
    fontSize: 12,
    color: '#888'
  }
});

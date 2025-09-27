import React, { useEffect, useState } from "react";
import { SafeAreaView, Text, FlatList, View, StyleSheet } from "react-native";

const BACKEND = "http://YOUR_BACKEND:5000"; 
// 🔴 replace YOUR_BACKEND with your backend URL

export default function Alerts() {
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
    const interval = setInterval(fetchAlerts, 5000); // refresh every 5s
    return () => clearInterval(interval);
  }, []);

  const renderItem = ({ item }) => {
    const color = item.tier === 2 ? "#ff4d4f" : item.tier === 1 ? "#faad14" : "#52c41a";
    return (
      <View style={[styles.card, { borderLeftColor: color }]}>
        <Text style={styles.timestamp}>{item.ts}</Text>
        <Text>{item.species.toUpperCase()}</Text>
        <Text>HR: {item.heart_rate} | SpO₂: {item.spo2} | Temp: {item.temperature} | RR: {item.resp_rate}</Text>
        <Text style={{ color }}>{item.tier === 2 ? "CRITICAL" : item.tier === 1 ? "WARNING" : "OK"}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Alerts History</Text>
      <FlatList
        data={alerts}
        keyExtractor={(item, idx) => idx.toString()}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 12 },
  card: {
    borderLeftWidth: 5,
    padding: 10,
    marginBottom: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  timestamp: { fontSize: 12, color: "#666", marginBottom: 4 },
});

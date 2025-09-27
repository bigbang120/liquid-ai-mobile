import React, { useState } from "react";
import { SafeAreaView, View, Text, TextInput, Button, StyleSheet } from "react-native";

const BACKEND = "http://YOUR_BACKEND:5000"; 
// 🔴 replace YOUR_BACKEND with your backend URL later (e.g. http://127.0.0.1:5000)

export default function App() {
  const [species, setSpecies] = useState("human");
  const [hr, setHr] = useState("78");
  const [spo2, setSpo2] = useState("98");
  const [temp, setTemp] = useState("36.8");
  const [rr, setRr] = useState("14");
  const [result, setResult] = useState(null);

  const color = result?.tier === 2 ? "#ff4d4f" : result?.tier === 1 ? "#faad14" : "#52c41a";
  const label = result?.tier === 2 ? "CRITICAL" : result?.tier === 1 ? "WARNING" : "OK";

  const predict = async () => {
    const payload = {
      species,
      heart_rate: parseFloat(hr),
      spo2: parseFloat(spo2),
      temperature: parseFloat(temp),
      resp_rate: parseFloat(rr)
    };
    try {
      const res = await fetch(`${BACKEND}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      setResult(json);
    } catch (e) { console.log(e); }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Liquid AI — MVP</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Species</Text>
        <Button title={species} onPress={() => setSpecies(species === "human" ? "cat" : "human")} />
      </View>

      <View style={styles.row}><Text style={styles.label}>HR</Text>
        <TextInput style={styles.input} value={hr} onChangeText={setHr} keyboardType="numeric" />
      </View>
      <View style={styles.row}><Text style={styles.label}>SpO₂</Text>
        <TextInput style={styles.input} value={spo2} onChangeText={setSpo2} keyboardType="numeric" />
      </View>
      <View style={styles.row}><Text style={styles.label}>Temp</Text>
        <TextInput style={styles.input} value={temp} onChangeText={setTemp} keyboardType="numeric" />
      </View>
      <View style={styles.row}><Text style={styles.label}>RR</Text>
        <TextInput style={styles.input} value={rr} onChangeText={setRr} keyboardType="numeric" />
      </View>

      <Button title="Predict" onPress={predict} />

      <View style={[styles.card, { borderColor: color }]}>
        <Text style={[styles.status, { color }]}>{label}</Text>
        {result && <Text>Score: {result.score?.toFixed(2)}</Text>}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, padding:20, gap:12, backgroundColor:"#fff" },
  title:{ fontSize:22, fontWeight:"700", marginBottom:8 },
  row:{ flexDirection:"row", alignItems:"center", justifyContent:"space-between" },
  label:{ fontSize:16, width:80 },
  input:{ borderWidth:1, borderColor:"#ddd", padding:8, width:120, borderRadius:6 },
  card:{ marginTop:16, padding:16, borderWidth:2, borderRadius:10 },
  status:{ fontSize:18, fontWeight:"700" }
});

import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, TextInput, ScrollView, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { loadUserProfile, saveUserProfile } from '../utils/profileStore';

const PillInput = ({ label, values, onChange }) => {
  const [text, setText] = useState('');
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.pillWrap}>
        {values.map((v, i) => (
          <View key={`${v}-${i}`} style={styles.pill}>
            <Text style={styles.pillText}>{v}</Text>
            <TouchableOpacity onPress={() => onChange(values.filter((x, idx) => idx !== i))}>
              <Text style={styles.pillX}>\u00d7</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <TextInput
        style={styles.input}
        placeholder={`Add ${label.toLowerCase()}...`}
        value={text}
        onChangeText={setText}
        onSubmitEditing={() => {
          const trimmed = text.trim();
          if (trimmed && !values.includes(trimmed)) onChange([...values, trimmed]);
          setText('');
        }}
        returnKeyType="done"
      />
    </View>
  );
};

export default function ProfileDetailsScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  // basic info
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [sex, setSex] = useState('unknown');
  const [species, setSpecies] = useState('human');
  const [height_cm, setHeight] = useState('');
  const [weight_kg, setWeight] = useState('');
  // health context
  const [conditions, setConditions] = useState([]);
  const [medications, setMedications] = useState([]);
  const [allergies, setAllergies] = useState([]);
  const [medicalHistory, setMedicalHistory] = useState('');
  const [emergencyContacts, setEmergencyContacts] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await loadUserProfile();
        if (data) {
          setName(data.name || '');
          setDob(data.dob || '');
          setSex(data.sex || 'unknown');
          setSpecies(data.species || 'human');
          setHeight(String(data.height_cm ?? ''));
          setWeight(String(data.weight_kg ?? ''));
          setConditions(data.conditions || []);
          setMedications(data.medications || []);
          setAllergies(data.allergies || []);
          setMedicalHistory(data.medicalHistory || '');
          setEmergencyContacts(data.emergencyContacts || []);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const profilePayload = useMemo(() => ({
    name,
    dob,
    sex,
    species,
    height_cm,
    weight_kg,
    conditions,
    medications,
    allergies,
    medicalHistory,
    emergencyContacts,
  }), [name, dob, sex, species, height_cm, weight_kg, conditions, medications, allergies, medicalHistory, emergencyContacts]);

  async function onSave() {
    setSaving(true);
    try {
      await saveUserProfile(profilePayload);
      if (navigation && navigation.goBack) {
        navigation.goBack();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading profile…</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.h1}>Personalized Profile</Text>

      <Text style={styles.label}>Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Full name" />

      <Text style={styles.label}>Date of birth (YYYY-MM-DD)</Text>
      <TextInput style={styles.input} value={dob} onChangeText={setDob} placeholder="1997-05-20" autoCapitalize="none" />

      <Text style={styles.label}>Sex</Text>
      <TextInput style={styles.input} value={sex} onChangeText={setSex} placeholder="female | male | intersex | unknown" />

      <Text style={styles.label}>Species</Text>
      <TextInput style={styles.input} value={species} onChangeText={setSpecies} placeholder="human | cat | dog | other" />

      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Height (cm)</Text>
          <TextInput style={styles.input} value={height_cm} onChangeText={setHeight} keyboardType="numeric" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Weight (kg)</Text>
          <TextInput style={styles.input} value={weight_kg} onChangeText={setWeight} keyboardType="numeric" />
        </View>
      </View>

      <PillInput label="Conditions" values={conditions} onChange={setConditions} />
      <PillInput label="Medications" values={medications} onChange={setMedications} />
      <PillInput label="Allergies" values={allergies} onChange={setAllergies} />

      <Text style={styles.label}>Medical history (brief)</Text>
      <TextInput
        style={[styles.input, { minHeight: 90, textAlignVertical: 'top' }]}
        multiline
        value={medicalHistory}
        onChangeText={setMedicalHistory}
        placeholder="e.g., Asthma since 2014, past pneumonia 2021…"
      />

      <Text style={styles.subtle}>Tip: add an emergency contact below so alerts can escalate.</Text>

      <Button title={saving ? 'Saving…' : 'Save profile'} onPress={onSave} disabled={saving} />
      <View style={{ height: 28 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  h1: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  label: { fontSize: 13, fontWeight: '600', marginTop: 12, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, backgroundColor: '#fff' },
  pillWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', borderRadius: 16, paddingHorizontal: 10, paddingVertical: 6, marginRight: 6, marginBottom: 6 },
  pillText: { fontSize: 13 },
  pillX: { marginLeft: 8, fontSize: 16, fontWeight: '700' },
  subtle: { color: '#64748b', fontSize: 12, marginTop: 8, marginBottom: 16 },
});

import { View, Text } from 'react-native';
import { mockAlerts } from '../lib/mockData';

export default function Alerts() {
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Alerts</Text>

      {mockAlerts.map((alert) => (
        <View key={alert.id} style={{ marginTop: 15 }}>
          <Text style={{ fontWeight: 'bold' }}>{alert.title}</Text>
          <Text>{alert.detail}</Text>
          <Text>Severity: {alert.severity}</Text>
        </View>
      ))}
    </View>
  );
}

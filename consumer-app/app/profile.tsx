import { View, Text } from 'react-native';
import { mockProfile } from '../lib/mockData';

export default function Profile() {
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Profile</Text>

      <Text>Name: {mockProfile.firstName}</Text>
      <Text>Age Range: {mockProfile.ageRange}</Text>
      <Text>Goals: {mockProfile.goals.join(', ')}</Text>
      <Text>Devices: {mockProfile.connectedDevices.join(', ')}</Text>
    </View>
  );
}

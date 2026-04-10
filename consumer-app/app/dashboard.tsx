import { View, Text } from 'react-native';

export default function Dashboard() {
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Today's Status</Text>
      <Text>Baseline: stable</Text>
      <Text>Risk: low</Text>
    </View>
  );
}

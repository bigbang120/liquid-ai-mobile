import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function Home() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Liquid AI</Text>
      <Text>Your body baseline, simplified</Text>

      <Button title="Connect Device" onPress={() => router.push('/connect')} />
      <Button title="View Dashboard" onPress={() => router.push('/dashboard')} />
    </View>
  );
}

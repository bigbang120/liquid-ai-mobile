import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, Platform, StyleSheet } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notifications!');
      return;
    }
    const { data } = await Notifications.getExpoPushTokenAsync();
    token = data;
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

export default function NotificationsScreen() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(null);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener((notif) => {
      setNotification(notif);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  async function schedulePushNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "You've got a new alert!",
        body: 'This is a test notification.',
        data: { someData: 'goes here' },
      },
      trigger: { seconds: 2 },
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <Text style={styles.token}>Expo Push Token: {expoPushToken}</Text>
      <View style={styles.buttonContainer}>
        <Button title="Schedule Test Notification" onPress={schedulePushNotification} />
      </View>
      {notification && (
        <View style={styles.notificationContainer}>
          <Text style={styles.notificationTitle}>
            Last notification: {notification.request.content.title}
          </Text>
          <Text style={styles.notificationBody}>{notification.request.content.body}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  token: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    marginVertical: 10,
    width: '100%',
  },
  notificationContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  notificationBody: {
    fontSize: 14,
    marginTop: 4,
  },
});

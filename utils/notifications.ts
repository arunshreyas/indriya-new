import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Configure how notifications appear when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('indriya-default', {
      name: 'Indriya Notifications',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#f4c32f',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return null;
    }
    
    try {
      token = (await Notifications.getExpoPushTokenAsync({
        projectId: 'your-project-id', // Will be set when you build
      })).data;
    } catch (e) {
      console.error('Error getting push token:', e);
    }
  } else {
    console.log('Must use physical device for Push Notifications');
  }

  return token;
}

// Schedule daily notifications
export async function scheduleDailyNotifications() {
  // Cancel existing notifications
  await Notifications.cancelAllScheduledNotificationsAsync();

  // Morning reminder (6:00 AM)
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Good Morning',
      body: 'Begin your day with focus. What is your practice today?',
      sound: true,
    },
    trigger: {
      hour: 6,
      minute: 0,
      repeats: true,
    } as Notifications.DailyTriggerInput,
  });

  // Evening reminder (6:00 PM)
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Evening Reflection',
      body: 'Take a moment to reflect on your day. What did you learn?',
      sound: true,
    },
    trigger: {
      hour: 18,
      minute: 0,
      repeats: true,
    } as Notifications.DailyTriggerInput,
  });

  console.log('Daily notifications scheduled');
}

export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

// Local notification for completing practice
export async function sendPracticeCompleteNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Practice Complete',
      body: 'Well done. Each mindful moment builds the path.',
      sound: true,
    },
    trigger: null, // Show immediately
  });
}

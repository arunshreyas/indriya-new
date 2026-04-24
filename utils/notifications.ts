import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure how notifications appear when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function setupNotifications() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('indriya-daily', {
      name: 'Indriya Daily Reminders',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#f4c32f',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  return finalStatus === 'granted';
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
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 6,
      minute: 0,
      channelId: 'indriya-daily',
    },
  });

  // Evening reminder (6:00 PM)
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Evening Reflection',
      body: 'Take a moment to reflect on your day. What did you learn?',
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 18,
      minute: 0,
      channelId: 'indriya-daily',
    },
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

import { indriyaApi } from '@/services/indriyaApi';
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { router, Stack } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View } from 'react-native';

const clerkPublishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

const tokenCache = {
  async getToken(key: string) {
    return SecureStore.getItemAsync(key);
  },
  async saveToken(key: string, value: string) {
    return SecureStore.setItemAsync(key, value);
  },
};

function EnsureApiUser() {
  const { getToken, isSignedIn, isLoaded } = useAuth();

  React.useEffect(() => {
    if (!isLoaded || !isSignedIn) {
      return;
    }

    indriyaApi.ensureUser(getToken).catch((error) => {
      console.error('Failed to ensure API user:', error);
    });
  }, [getToken, isLoaded, isSignedIn]);

  return null;
}

// function NotificationSetup() {
//   React.useEffect(() => {
//     const initNotifications = async () => {
//       try {
//         const hasPermission = await setupNotifications();
//         if (hasPermission) {
//           await scheduleDailyNotifications();
//         } else {
//           console.log('Notification permission denied');
//         }
//       } catch (error: any) {
//         console.error('Failed to setup notifications:', error);
//       }
//     };

//     initNotifications();
//   }, []);

//   return null;
// }

function AppStack() {
  const { isLoaded, isSignedIn } = useAuth();

  React.useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace('/welcome');
    }
  }, [isLoaded, isSignedIn]);

  return (
    <View style={{ flex: 1 }}>
      <EnsureApiUser />
      <Stack initialRouteName="welcome">
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="morning-ritual" options={{ headerShown: false }} />
        <Stack.Screen name="focus-training" options={{ headerShown: false }} />
        <Stack.Screen name="deep-work" options={{ headerShown: false }} />
        <Stack.Screen name="gita-reading" options={{ headerShown: false }} />
        <Stack.Screen name="evening-reflection" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
        <Stack.Screen name="wisdom-chapters" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="light" />
    </View>
  );
}

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={clerkPublishableKey} tokenCache={tokenCache}>
      <AppStack />
    </ClerkProvider>
  );
}

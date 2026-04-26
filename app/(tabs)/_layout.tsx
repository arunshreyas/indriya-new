import { useAuth } from '@clerk/clerk-expo';
import { Redirect, Tabs } from 'expo-router';
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

export default function TabLayout() {
  const { isSignedIn, isLoaded } = useAuth();

  if (isLoaded && !isSignedIn) {
    return <Redirect href="/welcome" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.backgroundDark,
          borderTopColor: Colors.borderLight,
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter',
          fontSize: 10,
          fontWeight: '700',
          letterSpacing: 1.2,
          textTransform: 'uppercase',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons 
              name="home" 
              size={24} 
              color={focused ? Colors.primary : Colors.textMuted}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="wisdom"
        options={{
          title: 'Wisdom',
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons 
              name="menu-book" 
              size={24} 
              color={focused ? Colors.primary : Colors.textMuted}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="dharma"
        options={{
          title: 'Dharma',
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons 
              name="lightbulb" 
              size={24} 
              color={focused ? Colors.primary : Colors.textMuted}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="reflection"
        options={{
          title: 'Reflection',
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons 
              name="edit-note" 
              size={24} 
              color={focused ? Colors.primary : Colors.textMuted}
            />
          ),
        }}
      />
    </Tabs>
  );
}

import { Colors } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
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
        name="practice"
        options={{
          title: 'Practice',
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons 
              name="self-improvement" 
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
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons 
              name="person" 
              size={24} 
              color={focused ? Colors.primary : Colors.textMuted}
            />
          ),
        }}
      />
    </Tabs>
  );
}

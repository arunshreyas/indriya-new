import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography } from '@/constants/theme';
import { router } from 'expo-router';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.settingsCard}
        onPress={() => router.push('/settings')}
      >
        <MaterialIcons name="settings" size={24} color={Colors.textMuted} />
        <Text style={styles.settingsText}>Settings</Text>
      </TouchableOpacity>
      
      <View style={styles.statsSection}>
        <Text style={styles.statsTitle}>Your Practice</Text>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>1</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Total Sessions</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundDark,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  settingsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${Colors.textLight}0F`, // 6% opacity
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    gap: 12,
  },
  settingsText: {
    fontFamily: Typography.display.join(','),
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textLight,
  },
  statsSection: {
    backgroundColor: `${Colors.textLight}0F`, // 6% opacity
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 16,
    padding: 24,
    gap: 24,
  },
  statsTitle: {
    fontFamily: Typography.display.join(','),
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textLight,
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  statNumber: {
    fontFamily: Typography.display.join(','),
    fontSize: 32,
    fontWeight: '700',
    color: Colors.primary,
  },
  statLabel: {
    fontFamily: Typography.display.join(','),
    fontSize: 14,
    color: Colors.textMuted,
  },
});

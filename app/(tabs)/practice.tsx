import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography } from '@/constants/theme';

export default function PracticeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Practice</Text>
      <MaterialIcons name="self-improvement" size={48} color={Colors.primary} />
      <Text style={styles.subtitle}>Daily spiritual practices</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundDark,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontFamily: Typography.serif.join(','),
    fontSize: 32,
    fontWeight: '700',
    color: Colors.textLight,
    marginBottom: 16,
  },
  subtitle: {
    fontFamily: Typography.display.join(','),
    fontSize: 16,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 8,
  },
});

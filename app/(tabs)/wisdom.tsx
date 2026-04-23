import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography } from '@/constants/theme';
import { router } from 'expo-router';

export default function WisdomScreen() {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.gitaCard}
        onPress={() => router.push('/gita-reading')}
      >
        <MaterialIcons name="menu-book" size={32} color={Colors.primary} />
        <Text style={styles.cardTitle}>Bhagavad Gita</Text>
        <Text style={styles.cardSubtitle}>Sacred wisdom with AI guidance</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.meditationCard}>
        <MaterialIcons name="self-improvement" size={32} color={Colors.textMuted} />
        <Text style={styles.cardTitle}>Meditation</Text>
        <Text style={styles.cardSubtitle}>Coming soon</Text>
      </TouchableOpacity>
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
  gitaCard: {
    backgroundColor: `${Colors.textLight}0F`, // 6% opacity
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  meditationCard: {
    backgroundColor: `${Colors.textLight}05`, // 2% opacity
    borderWidth: 1,
    borderColor: `${Colors.textLight}1A`, // 10% opacity
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    opacity: 0.6,
  },
  cardTitle: {
    fontFamily: Typography.display.join(','),
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textLight,
    marginTop: 16,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontFamily: Typography.display.join(','),
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});

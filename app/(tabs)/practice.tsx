import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import Card from '@/components/Card';
import ScreenWrapper from '@/components/ScreenWrapper';

type PracticeItem = {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  route: string;
  icon: any;
};

const PRACTICES: PracticeItem[] = [
  {
    id: 'morning-ritual',
    title: 'Morning Ritual',
    subtitle: 'Mantra and Intention',
    duration: '10 min',
    route: '/morning-ritual',
    icon: 'sunny',
  },
  {
    id: 'focus-training',
    title: 'Focus Training',
    subtitle: 'Mastery over Distraction',
    duration: 'Daily',
    route: '/focus-training',
    icon: 'eye-outline',
  },
  {
    id: 'deep-work',
    title: 'Deep Work Session',
    subtitle: 'Focused Productivity',
    duration: '45 min',
    route: '/deep-work',
    icon: 'hammer-outline',
  },
  {
    id: 'evening-reflection',
    title: 'Evening Reflection',
    subtitle: 'Close the day with awareness',
    duration: '10 min',
    route: '/evening-reflection',
    icon: 'moon-outline',
  },
];

export default function PracticeScreen() {
  const router = useRouter();

  return (
    <ScreenWrapper style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.headerTitle}>Practice</Text>

        <View style={styles.list}>
          {PRACTICES.map((practice) => (
            <Card 
              key={practice.id} 
              onPress={() => router.push(practice.route as any)} 
              style={styles.card}
            >
              <View style={styles.row}>
                <View style={styles.iconContainer}>
                  <Ionicons name={practice.icon} size={24} color={Colors.primary} />
                </View>
                <View style={styles.info}>
                  <Text style={styles.title}>{practice.title}</Text>
                  <Text style={styles.subtitle} numberOfLines={2}>
                    {practice.subtitle} • {practice.duration}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.textLight,
    marginBottom: 32,
    marginTop: 8,
    fontFamily: Typography.serif.join(','),
  },
  list: {
    gap: 12,
  },
  card: {
    paddingVertical: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${Colors.primary}1A`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textLight,
    marginBottom: 4,
    fontFamily: Typography.serif.join(','),
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    fontFamily: Typography.display.join(','),
  },
});

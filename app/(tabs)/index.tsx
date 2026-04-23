import { BorderRadius, Colors, Typography } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Ritual {
  id: string;
  title: string;
  description: string;
  status: 'not-started' | 'in-progress' | 'completed';
  locked?: boolean;
  unlockTime?: string;
  icons?: string[];
}

const todayRituals: Ritual[] = [
  {
    id: 'morning-ritual',
    title: 'Morning Ritual',
    description: 'Sensory Withdrawal (Pratyahara)',
    status: 'not-started',
    icons: ['air', 'spa'],
  },
  {
    id: 'evening-reflection',
    title: 'Evening Reflection',
    description: 'Contemplative Silence (Mauna)',
    status: 'not-started',
    locked: true,
    unlockTime: 'Available at Sunset',
  },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [dailyProgress] = React.useState(0);

  const handleBeginRitual = (ritualId: string) => {
    if (ritualId === 'morning-ritual') {
      router.push('/morning-ritual');
    }
  };

  const getStatusColor = (status: Ritual['status']) => {
    switch (status) {
      case 'completed':
        return Colors.success;
      case 'in-progress':
        return Colors.warning;
      default:
        return Colors.primary;
    }
  };

  const getStatusText = (status: Ritual['status']) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      default:
        return 'Not started';
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialIcons name="auto-awesome" size={24} color={Colors.primary} />
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <MaterialIcons name="person" size={20} color={Colors.textLight} />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Greeting & Status */}
        <View style={styles.greetingSection}>
          <Text style={styles.greeting}>Good morning.</Text>
          <View style={styles.statusRow}>
            <Text style={styles.dayCount}>Day 1 of Sadhana</Text>
          </View>

          {/* Progress Indicator */}
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Daily Mastery</Text>
              <Text style={styles.progressPercent}>{dailyProgress}%</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${dailyProgress + 2}%` }]} />
            </View>
          </View>
        </View>

        {/* Ritual Cards */}
        <View style={styles.ritualsSection}>
          <Text style={styles.sectionTitle}>Today&apos;s Rituals</Text>

          {todayRituals.map((ritual) => (
            <TouchableOpacity
              key={ritual.id}
              style={[
                styles.ritualCard,
                ritual.locked && styles.lockedCard
              ]}
              onPress={() => !ritual.locked && handleBeginRitual(ritual.id)}
              disabled={ritual.locked}
              activeOpacity={0.8}
            >
              <View style={styles.ritualHeader}>
                <View style={styles.ritualInfo}>
                  <Text style={[
                    styles.ritualTitle,
                    ritual.locked && styles.lockedText
                  ]}>
                    {ritual.title}
                  </Text>
                  <Text style={[
                    styles.ritualDescription,
                    ritual.locked && styles.lockedText
                  ]}>
                    {ritual.description}
                  </Text>
                </View>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: `${getStatusColor(ritual.status)}33` }
                ]}>
                  <Text style={[
                    styles.statusText,
                    { color: getStatusColor(ritual.status) }
                  ]}>
                    {getStatusText(ritual.status)}
                  </Text>
                </View>
              </View>

              {!ritual.locked && ritual.icons && (
                <View style={styles.ritualFooter}>
                  <View style={styles.iconRow}>
                    {ritual.icons.map((iconName, index) => (
                      <View key={index} style={styles.iconContainer}>
                        <MaterialIcons 
                          name={iconName as any} 
                          size={12} 
                          color={`${Colors.primary}B3`} // 70% opacity
                        />
                      </View>
                    ))}
                  </View>
                  <TouchableOpacity 
                    style={styles.beginButton}
                    onPress={() => handleBeginRitual(ritual.id)}
                  >
                    <Text style={styles.beginButtonText}>Begin</Text>
                  </TouchableOpacity>
                </View>
              )}

              {ritual.locked && (
                <View style={styles.lockedFooter}>
                  <View style={styles.lockInfo}>
                    <MaterialIcons 
                      name="schedule" 
                      size={12} 
                      color={Colors.textMuted} 
                    />
                    <Text style={styles.unlockText}>{ritual.unlockTime}</Text>
                  </View>
                </View>
              )}

              {/* Decorative Element */}
              <View style={styles.decorativeIcon}>
                <MaterialIcons 
                  name="spa" 
                  size={120} 
                  color={`${Colors.primary}0D`} // 5% opacity
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Focus Encouragement */}
        <View style={styles.encouragementSection}>
          <Text style={styles.encouragementText}>
            &quot;When senses are withdrawn from their objects, mind becomes steady.&quot;
          </Text>
        </View>
      </ScrollView>

      {/* Home Indicator */}
      <View style={styles.homeIndicator} />

      {/* Background Decoration */}
      <View style={styles.backgroundDecoration}>
        <View style={[styles.decorativeCircle, styles.topCircle]} />
        <View style={[styles.decorativeCircle, styles.bottomCircle]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundDark,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerLeft: {
    flex: 1,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: `${Colors.primary}1A`, // 10% opacity
    borderWidth: 1,
    borderColor: `${Colors.primary}33`, // 20% opacity
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  greetingSection: {
    marginBottom: 40,
  },
  greeting: {
    fontFamily: Typography.serif.join(','),
    fontSize: 42,
    fontWeight: '400',
    color: Colors.textLight,
    lineHeight: 50,
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dayCount: {
    fontFamily: Typography.display.join(','),
    fontSize: 10,
    fontWeight: '600',
    color: Colors.primary,
    letterSpacing: 3.2,
    textTransform: 'uppercase',
  },
  progressSection: {
    marginTop: 32,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  progressLabel: {
    fontFamily: Typography.display.join(','),
    fontSize: 10,
    color: `${Colors.textLight}66`, // 40% opacity
    fontWeight: '400',
    letterSpacing: 2.4,
    textTransform: 'uppercase',
  },
  progressPercent: {
    fontFamily: Typography.display.join(','),
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
  progressBar: {
    height: 1,
    backgroundColor: Colors.borderLight,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  ritualsSection: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontFamily: Typography.display.join(','),
    fontSize: 11,
    fontWeight: '600',
    color: `${Colors.textLight}66`, // 40% opacity
    letterSpacing: 2.4,
    textTransform: 'uppercase',
    marginBottom: 4,
    paddingHorizontal: 4,
  },
  ritualCard: {
    backgroundColor: `${Colors.textLight}0F`, // 6% opacity
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: BorderRadius.xl,
    padding: 24,
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  lockedCard: {
    backgroundColor: `${Colors.textLight}03`, // 1% opacity
    borderColor: `${Colors.textLight}0A`, // 4% opacity
    opacity: 0.4,
  },
  ritualHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  ritualInfo: {
    flex: 1,
  },
  ritualTitle: {
    fontFamily: Typography.display.join(','),
    fontSize: 20,
    fontWeight: '500',
    color: Colors.textLight,
    marginBottom: 4,
  },
  ritualDescription: {
    fontFamily: Typography.display.join(','),
    fontSize: 14,
    color: Colors.textMuted,
  },
  lockedText: {
    color: Colors.textLight,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontFamily: Typography.display.join(','),
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  ritualFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  iconRow: {
    flexDirection: 'row',
    gap: -8,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.backgroundDark,
    backgroundColor: '#71717A', // zinc-800
    alignItems: 'center',
    justifyContent: 'center',
  },
  beginButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
  },
  beginButtonText: {
    fontFamily: Typography.display.join(','),
    fontSize: 14,
    fontWeight: '700',
    color: Colors.backgroundDark,
  },
  lockedFooter: {
    marginTop: 32,
  },
  lockInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  unlockText: {
    fontFamily: Typography.display.join(','),
    fontSize: 10,
    color: `${Colors.textLight}4D`, // 30% opacity
    fontWeight: '400',
    letterSpacing: 2.4,
    textTransform: 'uppercase',
  },
  decorativeIcon: {
    position: 'absolute',
    right: -16,
    bottom: -16,
    opacity: 0.05,
    pointerEvents: 'none',
  },
  encouragementSection: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingBottom: 48,
  },
  encouragementText: {
    fontFamily: Typography.serif.join(','),
    fontSize: 13,
    color: `${Colors.textLight}33`, // 20% opacity
    lineHeight: 20,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  homeIndicator: {
    width: 128,
    height: 4,
    backgroundColor: `${Colors.textLight}1A`, // 10% opacity
    borderRadius: BorderRadius.full,
    alignSelf: 'center',
    marginBottom: 8,
  },
  backgroundDecoration: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  decorativeCircle: {
    position: 'absolute',
    borderRadius: BorderRadius.full,
  },
  topCircle: {
    top: '-10%',
    right: '-10%',
    width: 300,
    height: 300,
    backgroundColor: `${Colors.primary}0D`, // 5% opacity
  },
  bottomCircle: {
    bottom: '10%',
    left: '-10%',
    width: 250,
    height: 250,
    backgroundColor: `${Colors.primary}0D`, // 5% opacity
  },
});

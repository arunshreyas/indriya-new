import { BorderRadius, Colors, Shadow, Typography } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface DailyFocus {
  text: string;
  completed: boolean;
  date: string;
}

const FOCUS_STORAGE_KEY = '@indriya_daily_focus';

const focusPrompts = [
  'Remain mindful of your breath',
  'Observe your thoughts without judgment',
  'Act with awareness, not reaction',
  'Find stillness in movement',
  'Listen more than you speak',
  'Practice patience in all things',
  'See the divine in every being',
  'Let go of what you cannot control',
  'Focus on the present moment',
  'Cultivate inner silence',
  'Move through the world with grace',
  'Remember: you are not your thoughts',
  'Practice non-attachment today',
  'Find peace in simple actions',
  'Observe impulses before acting',
];

export default function PracticeScreen() {
  const insets = useSafeAreaInsets();
  const [todayFocus, setTodayFocus] = React.useState<DailyFocus | null>(null);

  React.useEffect(() => {
    loadTodayFocus();
  }, []);

  const loadTodayFocus = async () => {
    try {
      const stored = await AsyncStorage.getItem(FOCUS_STORAGE_KEY);
      const today = new Date().toDateString();

      if (stored) {
        const parsed: DailyFocus = JSON.parse(stored);
        if (parsed.date === today) {
          setTodayFocus(parsed);
        } else {
          // Generate new focus for new day
          generateNewFocus();
        }
      } else {
        generateNewFocus();
      }
    } catch (error) {
      console.error('Failed to load focus:', error);
      generateNewFocus();
    }
  };

  const generateNewFocus = async () => {
    const randomFocus = focusPrompts[Math.floor(Math.random() * focusPrompts.length)];
    const newFocus: DailyFocus = {
      text: randomFocus,
      completed: false,
      date: new Date().toDateString(),
    };
    setTodayFocus(newFocus);
    await AsyncStorage.setItem(FOCUS_STORAGE_KEY, JSON.stringify(newFocus));
  };

  const toggleComplete = async () => {
    if (!todayFocus) return;

    const updated = { ...todayFocus, completed: !todayFocus.completed };
    setTodayFocus(updated);
    await AsyncStorage.setItem(FOCUS_STORAGE_KEY, JSON.stringify(updated));
  };

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <MaterialIcons name="self-improvement" size={32} color={Colors.primary} />
        <Text style={styles.headerTitle}>Practice</Text>
        <Text style={styles.headerSubtitle}>Good {getTimeOfDay()}</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Today's Focus Card */}
        <View style={styles.focusCard}>
          <View style={styles.focusHeader}>
            <Text style={styles.focusLabel}>Today&apos;s Focus</Text>
            {todayFocus?.completed && (
              <View style={styles.completedBadge}>
                <MaterialIcons name="check-circle" size={14} color={Colors.success} />
                <Text style={styles.completedText}>Done</Text>
              </View>
            )}
          </View>

          <Text style={styles.focusText}>
            {todayFocus?.text || 'Loading...'}
          </Text>

          <TouchableOpacity
            style={[
              styles.actionButton,
              todayFocus?.completed && styles.completedButton,
            ]}
            onPress={toggleComplete}
            activeOpacity={0.8}
          >
            <MaterialIcons
              name={todayFocus?.completed ? 'check' : 'radio-button-unchecked'}
              size={20}
              color={todayFocus?.completed ? Colors.success : Colors.backgroundDark}
            />
            <Text
              style={[
                styles.actionButtonText,
                todayFocus?.completed && styles.completedButtonText,
              ]}
            >
              {todayFocus?.completed ? 'Practiced' : 'Mark as Practiced'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Simple Reminder */}
        <View style={styles.reminderCard}>
          <MaterialIcons name="lightbulb" size={20} color={Colors.primary} />
          <Text style={styles.reminderText}>
            Return to this focus throughout your day. A single mindful moment is enough.
          </Text>
        </View>

        {/* Bottom padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundDark,
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  headerTitle: {
    fontFamily: Typography.serif.join(','),
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textLight,
    marginTop: 12,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontFamily: Typography.display.join(','),
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  focusCard: {
    backgroundColor: `${Colors.primary}1A`,
    borderWidth: 1,
    borderColor: `${Colors.primary}33`,
    borderRadius: BorderRadius.xl,
    padding: 28,
    gap: 20,
    marginBottom: 20,
  },
  focusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  focusLabel: {
    fontFamily: Typography.display.join(','),
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: `${Colors.success}1A`,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  completedText: {
    fontFamily: Typography.display.join(','),
    fontSize: 11,
    fontWeight: '700',
    color: Colors.success,
  },
  focusText: {
    fontFamily: Typography.display.join(','),
    fontSize: 22,
    fontWeight: '500',
    color: Colors.textLight,
    lineHeight: 32,
    textAlign: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.xl,
    paddingVertical: 16,
    ...Shadow.primary,
  },
  completedButton: {
    backgroundColor: `${Colors.success}1A`,
    borderWidth: 1,
    borderColor: `${Colors.success}33`,
  },
  actionButtonText: {
    fontFamily: Typography.display.join(','),
    fontSize: 16,
    fontWeight: '700',
    color: Colors.backgroundDark,
  },
  completedButtonText: {
    color: Colors.success,
  },
  reminderCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: `${Colors.textLight}0A`,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: BorderRadius.xl,
    padding: 20,
  },
  reminderText: {
    fontFamily: Typography.display.join(','),
    fontSize: 14,
    color: Colors.textMuted,
    lineHeight: 20,
    flex: 1,
  },
  bottomPadding: {
    height: 32,
  },
});


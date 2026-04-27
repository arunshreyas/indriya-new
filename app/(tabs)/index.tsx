import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Shadow, BorderRadius } from '@/constants/theme';
import Card from '@/components/Card';
import ScreenWrapper from '@/components/ScreenWrapper';
import { indriyaApi, ApiReflection, ApiPractice } from '@/services/indriyaApi';

const FALLBACK_WISDOM = {
  source: 'Bhagavad Gita 2.47',
  preview: 'Your right is to perform your duty only, but never to its fruits.',
};

const getTimeBasedGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Suprabhatam';
  if (hour < 17) return 'Namaste';
  return 'Shubh Sandhya';
};

export default function HomeScreen() {
  const router = useRouter();
  const isFocused = useIsFocused();
  const { user } = useUser();
  const { getToken, isSignedIn } = useAuth();
  const [reflectionSnippet, setReflectionSnippet] = React.useState<string | null>(null);
  const [morningCompleted, setMorningCompleted] = React.useState(false);
  const [streak, setStreak] = React.useState(0);
  const [totalPractices, setTotalPractices] = React.useState(0);

  React.useEffect(() => {
    if (!isSignedIn || !isFocused) return;

    const loadDashboardData = async () => {
      try {
        const [reflections, practices] = await Promise.all([
          indriyaApi.getReflections(getToken).catch(() => []),
          indriyaApi.getPractices(getToken).catch(() => []),
        ]);

        if (reflections && reflections.length > 0) {
          const latest = reflections[0];
          setReflectionSnippet(latest.content.slice(0, 100));
        }

        if (practices && practices.length > 0) {
          // Calculate streak
          const completedPractices = practices.filter(p => p.completed)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          
          setTotalPractices(completedPractices.length);

          if (completedPractices.length > 0) {
            let currentStreak = 0;
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            let lastDate = today;
            
            // Check if today is completed
            const firstPracticeDate = new Date(completedPractices[0].date);
            firstPracticeDate.setHours(0, 0, 0, 0);
            
            if (firstPracticeDate.getTime() === today.getTime()) {
              setMorningCompleted(true);
            } else {
              setMorningCompleted(false);
              // If last practice was not today or yesterday, streak is 0
              const yesterday = new Date(today);
              yesterday.setDate(yesterday.getDate() - 1);
              if (firstPracticeDate.getTime() !== yesterday.getTime()) {
                setStreak(0);
                return;
              }
              lastDate = yesterday;
            }

            // Count consecutive days
            currentStreak = 1;
            for (let i = 1; i < completedPractices.length; i++) {
              const pDate = new Date(completedPractices[i].date);
              pDate.setHours(0,0,0,0);
              
              const expectedDate = new Date(lastDate);
              expectedDate.setDate(expectedDate.getDate() - 1);

              if (pDate.getTime() === expectedDate.getTime()) {
                currentStreak++;
                lastDate = expectedDate;
              } else if (pDate.getTime() < expectedDate.getTime()) {
                break; // Gap in streak
              }
              // If multiple practices on same day, ignore and continue
            }
            setStreak(currentStreak);
          }
        }
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      }
    };

    loadDashboardData();
  }, [getToken, isSignedIn, isFocused]);

  const userDisplayName = user?.firstName || user?.username || 'Seeker';

  return (
    <ScreenWrapper style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getTimeBasedGreeting()}, {userDisplayName}.</Text>
            <Text style={styles.date}>Daily Sadhana</Text>
          </View>
          <TouchableOpacity 
            onPress={() => router.push('/settings')}
            style={styles.profileIcon}
          >
            <Ionicons name="person-circle-outline" size={32} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* Dashboard Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <MaterialIcons name="local-fire-department" size={24} color={Colors.primary} />
              <Text style={styles.statValue}>{streak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <MaterialIcons name="self-improvement" size={24} color={Colors.primary} />
              <Text style={styles.statValue}>{totalPractices}</Text>
              <Text style={styles.statLabel}>Total Rituals</Text>
            </View>
          </View>
          <Card
            title="Today's Wisdom"
            onPress={() => router.push('/wisdom')}
            style={styles.wisdomCard}
          >
            <Text style={styles.wisdomText}>&quot;{FALLBACK_WISDOM.preview}&quot;</Text>
            <Text style={styles.wisdomSource}>- {FALLBACK_WISDOM.source}</Text>
            <View style={styles.cardFooter}>
              <Text style={styles.linkText}>Read more</Text>
              <Ionicons name="arrow-forward" size={16} color={Colors.primary} />
            </View>
          </Card>

          <Card title="Today's Practice" onPress={() => router.push('/morning-ritual')}>
            <View style={styles.practiceItem}>
              <View style={styles.practiceIcon}>
                <Ionicons name="sunny-outline" size={24} color={Colors.backgroundDark} />
              </View>
              <View style={styles.practiceInfo}>
                <Text style={styles.practiceTitle}>Morning Ritual - 10 min</Text>
                <Text style={styles.practiceStatus}>
                  {morningCompleted ? 'Completed for today' : 'Continue your daily discipline'}
                </Text>
              </View>
              <Ionicons
                name={morningCompleted ? 'checkmark-circle' : 'chevron-forward'}
                size={24}
                color={morningCompleted ? Colors.success : Colors.textMuted}
              />
            </View>
          </Card>

          <Card title="Reflection" onPress={() => router.push('/reflection')}>
            <Text style={styles.reflectionPreview}>
              {reflectionSnippet || 'Close the day with awareness and journal what you learned.'}
            </Text>
            <TouchableOpacity 
              style={styles.reflectionAction}
              onPress={() => router.push('/reflection')}
            >
              <Text style={styles.reflectionActionText}>
                {reflectionSnippet ? 'EDIT REFLECTION' : 'ADD NOTE'}
              </Text>
              <MaterialIcons name="edit-note" size={18} color={Colors.primary} />
            </TouchableOpacity>
          </Card>

          {/* Ask for guidance shortcut */}
          <TouchableOpacity
            style={styles.guidanceButton}
            onPress={() => router.push('/dharma')}
            activeOpacity={0.8}
          >
            <View style={styles.guidanceIcon}>
              <MaterialIcons name="lightbulb" size={24} color={Colors.backgroundDark} />
            </View>
            <View style={styles.guidanceContent}>
              <Text style={styles.guidanceTitle}>Seek Guidance</Text>
              <Text style={styles.guidanceSubtitle}>Bring a situation to Dharma</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={Colors.backgroundDark} />
          </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 8,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.textLight,
    fontFamily: Typography.serif.join(','),
  },
  date: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontFamily: Typography.display.join(','),
  },
  profileIcon: {
    padding: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: `${Colors.neutralDark}66`,
    borderRadius: BorderRadius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginBottom: 8,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.borderLight,
    marginHorizontal: 16,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textLight,
    fontFamily: Typography.display.join(','),
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  content: {
    gap: 16,
  },
  wisdomCard: {
    borderColor: Colors.primary,
    borderWidth: 0.5,
  },
  wisdomText: {
    fontSize: 19,
    fontStyle: 'italic',
    color: Colors.textLight,
    fontFamily: Typography.serif.join(','),
    marginBottom: 8,
    lineHeight: 28,
  },
  wisdomSource: {
    fontSize: 14,
    color: Colors.primary,
    textAlign: 'right',
    marginBottom: 12,
    fontWeight: '600',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 4,
  },
  linkText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  practiceItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  practiceIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  practiceInfo: {
    flex: 1,
  },
  practiceTitle: {
    color: Colors.textLight,
    fontSize: 16,
    fontWeight: '600',
  },
  practiceStatus: {
    color: Colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  reflectionPreview: {
    color: Colors.textMuted,
    fontStyle: 'italic',
    lineHeight: 20,
    fontSize: 14,
  },
  reflectionAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 6,
  },
  reflectionActionText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  guidanceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    ...Shadow.primary,
  },
  guidanceIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  guidanceContent: {
    flex: 1,
  },
  guidanceTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.backgroundDark,
  },
  guidanceSubtitle: {
    fontSize: 13,
    color: 'rgba(0,0,0,0.6)',
    fontWeight: '500',
  },
});


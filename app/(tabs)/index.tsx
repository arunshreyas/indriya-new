import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, Typography, BorderRadius, Shadow } from '@/constants/theme';
import { UserStorage } from '@/utils/userStorage';

const getTodayKey = () => new Date().toISOString().slice(0, 10);

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [intention, setIntention] = React.useState('Develop discipline and reduce distractions');
  const [practicedToday, setPracticedToday] = React.useState(false);

  const loadUserData = React.useCallback(async () => {
    const data = await UserStorage.getUserData();
    if (data.intention) {
      setIntention(data.intention);
    }
    setPracticedToday(data.lastPracticeDate === getTodayKey());
  }, []);

  React.useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const markPracticed = async () => {
    await UserStorage.saveUserData({ lastPracticeDate: getTodayKey() });
    setPracticedToday(true);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Welcome back</Text>
          <Text style={styles.subtext}>Return to your practice</Text>
        </View>
        
        {/* Intention Card */}
        <View style={styles.intentionCard}>
          <Text style={styles.intentionTitle}>Your Intention</Text>
          <Text style={styles.intentionText}>{intention}</Text>
          <Text style={styles.intentionSubtext}>Return to this daily</Text>
        </View>

        {/* Today's Focus Card */}
        <View style={styles.focusCard}>
          <Text style={styles.focusTitle}>{"Today's Focus"}</Text>
          <Text style={styles.focusText}>Remain mindful of impulses</Text>
          <TouchableOpacity
            style={[styles.actionButton, practicedToday && styles.actionButtonComplete]}
            onPress={markPracticed}
            activeOpacity={0.8}
          >
            <MaterialIcons name="check" size={20} color={Colors.backgroundDark} />
            <Text style={styles.actionButtonText}>
              {practicedToday ? 'Practiced Today' : 'Mark as Practiced'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Main Sections */}
        <View style={styles.sectionsContainer}>
          {/* Wisdom Card */}
          <TouchableOpacity
            style={styles.sectionCard}
            onPress={() => router.push('/wisdom')}
            activeOpacity={0.8}
          >
            <View style={styles.sectionIcon}>
              <MaterialIcons name="menu-book" size={24} color={Colors.primary} />
            </View>
            <View style={styles.sectionContent}>
              <Text style={styles.sectionTitle}>Wisdom</Text>
              <Text style={styles.sectionSubtitle}>Bhagavad Gita</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={Colors.textMuted} />
          </TouchableOpacity>

          {/* Dharma Card */}
          <TouchableOpacity
            style={styles.sectionCard}
            onPress={() => router.push('/dharma')}
            activeOpacity={0.8}
          >
            <View style={styles.sectionIcon}>
              <MaterialIcons name="lightbulb" size={24} color={Colors.primary} />
            </View>
            <View style={styles.sectionContent}>
              <Text style={styles.sectionTitle}>Dharma</Text>
              <Text style={styles.sectionSubtitle}>Seek guidance</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={Colors.textMuted} />
          </TouchableOpacity>

          {/* Reflection Card */}
          <TouchableOpacity
            style={styles.sectionCard}
            onPress={() => router.push('/reflection')}
            activeOpacity={0.8}
          >
            <View style={styles.sectionIcon}>
              <MaterialIcons name="edit-note" size={24} color={Colors.primary} />
            </View>
            <View style={styles.sectionContent}>
              <Text style={styles.sectionTitle}>Reflection</Text>
              <Text style={styles.sectionSubtitle}>Your thoughts</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={Colors.textMuted} />
          </TouchableOpacity>
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
    backgroundColor: '#0E0E0E',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 40,
  },
  greeting: {
    fontFamily: Typography.display.join(','),
    fontSize: 32,
    fontWeight: '300',
    color: '#EAEAEA',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtext: {
    fontFamily: Typography.display.join(','),
    fontSize: 16,
    fontWeight: '400',
    color: '#EAEAEA80',
    textAlign: 'center',
  },
  focusCard: {
    backgroundColor: '#C6A75E1A',
    borderWidth: 1,
    borderColor: '#C6A75E33',
    borderRadius: BorderRadius.xl,
    padding: 32,
    marginBottom: 32,
    alignItems: 'center',
    ...Shadow.primary,
  },
  intentionCard: {
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#2A2A2A',
    borderRadius: BorderRadius.xl,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
  },
  intentionTitle: {
    fontFamily: Typography.display.join(','),
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  intentionText: {
    fontFamily: Typography.serif.join(','),
    fontSize: 20,
    fontWeight: '400',
    color: '#EAEAEA',
    lineHeight: 28,
    textAlign: 'center',
    marginBottom: 8,
  },
  intentionSubtext: {
    fontFamily: Typography.display.join(','),
    fontSize: 12,
    color: '#EAEAEA60',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  focusTitle: {
    fontFamily: Typography.display.join(','),
    fontSize: 14,
    fontWeight: '700',
    color: '#C6A75E',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  focusText: {
    fontFamily: Typography.display.join(','),
    fontSize: 24,
    fontWeight: '500',
    color: '#EAEAEA',
    lineHeight: 34,
    textAlign: 'center',
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#C6A75E',
    borderRadius: BorderRadius.xl,
    paddingVertical: 16,
    paddingHorizontal: 32,
    minWidth: 200,
    ...Shadow.primary,
  },
  actionButtonComplete: {
    opacity: 0.72,
  },
  actionButtonText: {
    fontFamily: Typography.display.join(','),
    fontSize: 16,
    fontWeight: '700',
    color: '#0E0E0E',
  },
  sectionsContainer: {
    gap: 16,
  },
  sectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#2A2A2A',
    borderRadius: BorderRadius.lg,
    padding: 20,
    gap: 16,
  },
  sectionIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    backgroundColor: '#C6A75E1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionContent: {
    flex: 1,
  },
  sectionTitle: {
    fontFamily: Typography.display.join(','),
    fontSize: 18,
    fontWeight: '600',
    color: '#EAEAEA',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontFamily: Typography.display.join(','),
    fontSize: 14,
    fontWeight: '400',
    color: '#EAEAEA80',
  },
  bottomPadding: {
    height: 32,
  },
});

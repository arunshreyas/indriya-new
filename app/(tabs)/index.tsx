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

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [intention, setIntention] = React.useState('Develop discipline and reduce distractions');

  const loadUserData = React.useCallback(async () => {
    const data = await UserStorage.getUserData();
    if (data.intention) {
      setIntention(data.intention);
    }
  }, []);

  React.useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Welcome back</Text>
              <Text style={styles.subtext}>Return with steadiness</Text>
            </View>
            <TouchableOpacity 
              onPress={() => router.push('/settings')}
              style={styles.settingsButton}
            >
              <MaterialIcons name="settings" size={28} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Daily Direction */}
        <View style={styles.directionCard}>
          <View style={styles.directionTopRow}>
            <Text style={styles.eyebrow}>Today</Text>
            <MaterialIcons name="wb-sunny" size={18} color={Colors.primary} />
          </View>
          <Text style={styles.directionTitle}>Act from clarity, not impulse.</Text>
          <Text style={styles.directionText}>
            Pause before reacting. Let your next action come from dharma, not restlessness.
          </Text>
        </View>

        {/* Intention */}
        <View style={styles.intentionPanel}>
          <Text style={styles.panelLabel}>Long-term Intention</Text>
          <Text style={styles.intentionText}>{intention}</Text>
        </View>

        {/* Main Guidance */}
        <View style={styles.primaryActions}>
          <TouchableOpacity
            style={styles.primaryAction}
            onPress={() => router.push('/dharma')}
            activeOpacity={0.82}
          >
            <View style={styles.primaryActionIcon}>
              <MaterialIcons name="lightbulb" size={24} color={Colors.backgroundDark} />
            </View>
            <View style={styles.primaryActionContent}>
              <Text style={styles.primaryActionTitle}>Ask for guidance</Text>
              <Text style={styles.primaryActionSubtitle}>Bring a situation to Dharma</Text>
            </View>
            <MaterialIcons name="arrow-forward" size={20} color={Colors.backgroundDark} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryAction}
            onPress={() => router.push('/morning-ritual')}
            activeOpacity={0.82}
          >
            <MaterialIcons name="self-improvement" size={22} color={Colors.primary} />
            <Text style={styles.secondaryActionText}>Begin morning practice</Text>
          </TouchableOpacity>
        </View>

        {/* Reflection Prompt */}
        <View style={styles.promptPanel}>
          <Text style={styles.panelLabel}>Reflection Prompt</Text>
          <Text style={styles.promptText}>Where did your mind pull you today?</Text>
          <TouchableOpacity
            style={styles.promptButton}
            onPress={() => router.push('/reflection')}
            activeOpacity={0.8}
          >
            <Text style={styles.promptButtonText}>Write reflection</Text>
            <MaterialIcons name="edit-note" size={18} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Library */}
        <View style={styles.sectionsContainer}>
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
              <Text style={styles.sectionSubtitle}>Read the Bhagavad Gita</Text>
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
    paddingTop: 32,
    paddingBottom: 28,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  settingsButton: {
    padding: 8,
    marginRight: -8,
  },
  greeting: {
    fontFamily: Typography.display.join(','),
    fontSize: 30,
    fontWeight: '500',
    color: '#EAEAEA',
    marginBottom: 8,
  },
  subtext: {
    fontFamily: Typography.display.join(','),
    fontSize: 16,
    fontWeight: '400',
    color: '#EAEAEA80',
  },
  directionCard: {
    backgroundColor: '#C6A75E1A',
    borderWidth: 1,
    borderColor: '#C6A75E33',
    borderRadius: BorderRadius.xl,
    padding: 24,
    marginBottom: 20,
    ...Shadow.primary,
  },
  directionTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  eyebrow: {
    fontFamily: Typography.display.join(','),
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  directionTitle: {
    fontFamily: Typography.serif.join(','),
    fontSize: 28,
    fontWeight: '700',
    color: '#EAEAEA',
    lineHeight: 36,
    marginBottom: 12,
  },
  directionText: {
    fontFamily: Typography.display.join(','),
    fontSize: 15,
    color: '#EAEAEAB3',
    lineHeight: 23,
  },
  intentionPanel: {
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#2A2A2A',
    borderRadius: BorderRadius.xl,
    padding: 20,
    marginBottom: 16,
  },
  panelLabel: {
    fontFamily: Typography.display.join(','),
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  intentionText: {
    fontFamily: Typography.serif.join(','),
    fontSize: 19,
    fontWeight: '400',
    color: '#EAEAEA',
    lineHeight: 27,
  },
  primaryActions: {
    gap: 12,
    marginBottom: 16,
  },
  primaryAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.xl,
    padding: 18,
    ...Shadow.primary,
  },
  primaryActionIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    backgroundColor: '#0E0E0E1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryActionContent: {
    flex: 1,
  },
  primaryActionTitle: {
    fontFamily: Typography.display.join(','),
    fontSize: 18,
    fontWeight: '700',
    color: Colors.backgroundDark,
    marginBottom: 3,
  },
  primaryActionSubtitle: {
    fontFamily: Typography.display.join(','),
    fontSize: 13,
    fontWeight: '500',
    color: '#0E0E0EA6',
  },
  secondaryAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#2A2A2A',
    borderRadius: BorderRadius.xl,
    padding: 18,
  },
  secondaryActionText: {
    fontFamily: Typography.display.join(','),
    fontSize: 16,
    fontWeight: '600',
    color: '#EAEAEA',
  },
  promptPanel: {
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#2A2A2A',
    borderRadius: BorderRadius.xl,
    padding: 20,
    marginBottom: 16,
  },
  promptText: {
    fontFamily: Typography.display.join(','),
    fontSize: 17,
    color: '#EAEAEA',
    lineHeight: 25,
    marginBottom: 16,
  },
  promptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
    paddingVertical: 10,
  },
  promptButtonText: {
    fontFamily: Typography.display.join(','),
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
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

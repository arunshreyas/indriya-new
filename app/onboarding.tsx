import { BorderRadius, Colors, Shadow, Typography } from '@/constants/theme';
import { indriyaApi } from '@/services/indriyaApi';
import { UserStorage } from '@/utils/userStorage';
import { useAuth } from '@clerk/clerk-expo';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface IntentionOption {
  id: string;
  title: string;
  description: string;
  intention: string;
}

const intentionOptions: IntentionOption[] = [
  {
    id: 'discipline',
    title: 'Discipline',
    description: 'Consistency and rigor',
    intention: 'Develop discipline and reduce distractions',
  },
  {
    id: 'calm',
    title: 'Calm',
    description: 'Stillness and sensory withdrawal',
    intention: 'Cultivate calm and return to stillness',
  },
  {
    id: 'self-control',
    title: 'Self-control',
    description: 'Mastery over impulses',
    intention: 'Practice self-control over impulses',
  },
];

export default function OnboardingScreen() {
  const [selectedIntention, setSelectedIntention] = useState('discipline');
  const insets = useSafeAreaInsets();
  const { getToken, isSignedIn } = useAuth();

  const handleBeginPractice = async () => {
    const selected = intentionOptions.find((option) => option.id === selectedIntention);
    const intention = selected?.intention ?? intentionOptions[0].intention;

    await UserStorage.saveUserData({
      intention,
      onboarded: true,
    });

    if (isSignedIn) {
      await indriyaApi.createIntention(getToken, { content: intention }).catch((error) => {
        console.error('Failed to save intention to API:', error);
      });
    }

    router.replace('/(tabs)');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Status Bar Space */}
      <View style={styles.statusBar}>
        <Text style={styles.timeText}>9:41</Text>
        <View style={styles.statusIcons}>
          <MaterialIcons name="signal-cellular-alt" size={18} color={Colors.textMuted} />
          <MaterialIcons name="wifi" size={18} color={Colors.textMuted} />
          <MaterialIcons name="battery-full" size={18} color={Colors.textMuted} />
        </View>
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>
          Begin with{'\n'}intention.
        </Text>
        <Text style={styles.subtitle}>
          Indriya is a daily discipline practice rooted in Sanatana Dharma.
        </Text>
      </View>

      {/* Intention Options */}
      <View style={styles.intentionSection}>
        {intentionOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={styles.intentionOption}
            onPress={() => setSelectedIntention(option.id)}
            activeOpacity={0.8}
          >
            <View style={[
              styles.intentionCard,
              selectedIntention === option.id && styles.selectedCard
            ]}>
              <View style={styles.intentionContent}>
                <Text style={[
                  styles.intentionTitle,
                  selectedIntention === option.id && styles.selectedTitle
                ]}>
                  {option.title}
                </Text>
                <Text style={[
                  styles.intentionDescription,
                  selectedIntention === option.id && styles.selectedDescription
                ]}>
                  {option.description}
                </Text>
              </View>
              <View style={[
                styles.radioIndicator,
                selectedIntention === option.id && styles.selectedRadio
              ]} />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Fixed Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity
          style={styles.beginButton}
          onPress={handleBeginPractice}
          activeOpacity={0.8}
        >
          <Text style={styles.beginButtonText}>Begin Practice</Text>
        </TouchableOpacity>
        
        {/* iOS Home Indicator */}
        <View style={styles.homeIndicator} />
      </View>

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
    maxWidth: 430,
    width: '100%',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 16,
    paddingBottom: 8,
  },
  timeText: {
    fontFamily: Typography.display.join(','),
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textLight,
  },
  statusIcons: {
    flexDirection: 'row',
    gap: 6,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 32,
  },
  title: {
    fontFamily: Typography.display.join(','),
    fontSize: 36,
    fontWeight: '700',
    color: Colors.textLight,
    lineHeight: 44,
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: Typography.display.join(','),
    fontSize: 17,
    color: `${Colors.primary}B3`, // 70% opacity
    lineHeight: 24,
  },
  intentionSection: {
    flex: 1,
    paddingHorizontal: 24,
    gap: 16,
  },
  intentionOption: {
    cursor: 'pointer',
  },
  intentionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.saffronMuted,
    backgroundColor: `${Colors.neutralDark}66`, // 40% opacity
    padding: 20,
  },
  selectedCard: {
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}0D`, // 5% opacity
  },
  intentionContent: {
    flex: 1,
    gap: 4,
  },
  intentionTitle: {
    fontFamily: Typography.display.join(','),
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textLight,
    lineHeight: 24,
  },
  selectedTitle: {
    // Title stays the same when selected
  },
  intentionDescription: {
    fontFamily: Typography.display.join(','),
    fontSize: 14,
    color: Colors.textMuted,
    lineHeight: 20,
  },
  selectedDescription: {
    // Description stays the same when selected
  },
  radioIndicator: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.full,
    borderWidth: 2,
    borderColor: Colors.saffronMuted,
    backgroundColor: 'transparent',
  },
  selectedRadio: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 48,
  },
  beginButton: {
    width: '100%',
    height: 58,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    ...Shadow.primary,
  },
  beginButtonText: {
    fontFamily: Typography.display.join(','),
    fontSize: 17,
    fontWeight: '700',
    color: Colors.backgroundDark,
    letterSpacing: 0.5,
  },
  homeIndicator: {
    width: 128,
    height: 4,
    backgroundColor: `${Colors.textLight}33`, // 20% opacity
    borderRadius: BorderRadius.full,
    alignSelf: 'center',
    marginTop: 32,
  },
  backgroundDecoration: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    opacity: 0.1,
    pointerEvents: 'none',
  },
  decorativeCircle: {
    position: 'absolute',
    borderRadius: BorderRadius.full,
  },
  topCircle: {
    top: 0,
    right: 0,
    width: 256,
    height: 256,
    backgroundColor: `${Colors.primary}33`, // 20% opacity
    filter: 'blur(120px)',
  },
  bottomCircle: {
    bottom: 0,
    left: 0,
    width: 256,
    height: 256,
    backgroundColor: `${Colors.primary}1A`, // 10% opacity
    filter: 'blur(120px)',
  },
});

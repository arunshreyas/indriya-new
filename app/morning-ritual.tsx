import { BorderRadius, Colors, Shadow, Typography } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MorningRitualScreen() {
  const insets = useSafeAreaInsets();
  const [isPlaying, setIsPlaying] = React.useState(false);

  const handlePlayAudio = () => {
    setIsPlaying(!isPlaying);
  };

  const handleCompleteRitual = () => {
    // TODO: Mark ritual as completed
    router.back();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Top Navigation */}
      <View style={styles.topNav}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back-ios" size={24} color={Colors.textMuted} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Morning Ritual</Text>
        <View style={styles.navSpacer} />
      </View>

      {/* Main Content (Meditation Space) */}
      <View style={styles.mainContent}>
        {/* Sacred Text Section */}
        <View style={styles.sacredTextSection}>
          <Text style={styles.mantraText}>
            ॐ पूर्णमदः पूर्णमिदं
          </Text>
          <Text style={styles.translationText}>
            {'"That is whole; this is whole. From wholeness, wholeness comes."'}
          </Text>
        </View>

        {/* Audio Control */}
        <View style={styles.audioControl}>
          <TouchableOpacity 
            style={styles.playButton}
            onPress={handlePlayAudio}
            activeOpacity={0.8}
          >
            <MaterialIcons 
              name={isPlaying ? "pause" : "play-arrow"} 
              size={48} 
              color={Colors.primary}
              style={styles.playIcon}
            />
          </TouchableOpacity>
          <Text style={styles.audioLabel}>Begin Audio Guide</Text>
        </View>

        {/* Intention Card */}
        <View style={styles.intentionCard}>
          <View style={styles.intentionCardInner}>
            <Text style={styles.intentionLabel}>Intention</Text>
            <Text style={styles.intentionText}>
              Today, act with restraint and clarity.
            </Text>
          </View>
        </View>
      </View>

      {/* Footer Action */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity 
          style={styles.completeButton}
          onPress={handleCompleteRitual}
          activeOpacity={0.8}
        >
          <Text style={styles.completeButtonText}>Complete Ritual</Text>
          <MaterialIcons 
            name="check-circle" 
            size={20} 
            color={Colors.backgroundDark}
            style={styles.completeIcon}
          />
        </TouchableOpacity>
        
        {/* Progress Indicator Dots */}
        <View style={styles.progressDots}>
          <View style={[styles.dot, styles.activeDot]} />
          <View style={[styles.dot, styles.inactiveDot]} />
          <View style={[styles.dot, styles.inactiveDot]} />
        </View>
      </View>

      {/* Subtle Atmospheric Decoration */}
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
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 32,
  },
  navTitle: {
    fontFamily: Typography.display.join(','),
    fontSize: 14,
    color: `${Colors.textLight}99`, // 60% opacity
    fontWeight: '600',
    letterSpacing: 3.2,
    textTransform: 'uppercase',
    paddingRight: 24,
  },
  navSpacer: {
    width: 24,
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 48,
  },
  sacredTextSection: {
    alignItems: 'center',
    gap: 24,
  },
  mantraText: {
    fontFamily: Typography.devanagari.join(','),
    fontSize: 60,
    fontWeight: '700',
    color: Colors.textLight,
    lineHeight: 72,
    textAlign: 'center',
  },
  translationText: {
    fontFamily: Typography.display.join(','),
    fontSize: 18,
    fontWeight: '300',
    color: `${Colors.textLight}CC`, // 80% opacity
    lineHeight: 28,
    fontStyle: 'italic',
    textAlign: 'center',
    maxWidth: 280,
    marginHorizontal: 'auto',
  },
  audioControl: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  playButton: {
    width: 96,
    height: 96,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: `${Colors.primary}4D`, // 30% opacity
    backgroundColor: `${Colors.primary}0D`, // 5% opacity
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  playIcon: {
    transform: [{ scale: 1.1 }],
  },
  audioLabel: {
    fontFamily: Typography.display.join(','),
    fontSize: 12,
    color: `${Colors.primary}99`, // 60% opacity
    fontWeight: '500',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  intentionCard: {
    width: '100%',
    maxWidth: 344,
  },
  intentionCardInner: {
    position: 'relative',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: `${Colors.primary}33`, // 20% opacity
    backgroundColor: `${Colors.backgroundDark}80`, // 50% opacity
    padding: 24,
  },
  intentionLabel: {
    fontFamily: Typography.display.join(','),
    fontSize: 12,
    color: `${Colors.primary}B3`, // 70% opacity
    fontWeight: '700',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  intentionText: {
    fontFamily: Typography.display.join(','),
    fontSize: 16,
    fontWeight: '400',
    color: Colors.textLight,
    lineHeight: 24,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 32,
    paddingTop: 24,
    paddingBottom: 48,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    height: 56,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadow.primary,
  },
  completeButtonText: {
    fontFamily: Typography.display.join(','),
    fontSize: 18,
    fontWeight: '700',
    color: Colors.backgroundDark,
  },
  completeIcon: {
    fontWeight: '700',
  },
  progressDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 32,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: BorderRadius.full,
  },
  activeDot: {
    backgroundColor: Colors.primary,
  },
  inactiveDot: {
    backgroundColor: `${Colors.primary}33`, // 20% opacity
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
    left: '-10%',
    width: 200,
    height: 160,
    backgroundColor: `${Colors.primary}0D`, // 5% opacity
  },
  bottomCircle: {
    bottom: '-5%',
    right: '-10%',
    width: 240,
    height: 160,
    backgroundColor: `${Colors.primary}0D`, // 5% opacity
  },
});

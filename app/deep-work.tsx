import { BorderRadius, Colors, Shadow, Typography } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function DeepWorkScreen() {
  const insets = useSafeAreaInsets();
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 minutes
  const [isActive, setIsActive] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(45 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (45 * 60 - timeLeft) / (45 * 60);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Top Navigation */}
      <View style={styles.topNav}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back-ios" size={24} color={Colors.textMuted} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Deep Work</Text>
        <View style={styles.navSpacer} />
      </View>

      <View style={styles.mainContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Sacred Focus</Text>
          <Text style={styles.subtitle}>{"One-pointed concentration is the key to excellence."}</Text>
        </View>

        {/* Timer Visual */}
        <View style={styles.timerContainer}>
          <View style={styles.timerCircle}>
            <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
            <Text style={styles.timerLabel}>remaining</Text>
          </View>
          
          {/* Progress Bar */}
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
          </View>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity 
            style={[styles.mainButton, isActive && styles.pauseButton]} 
            onPress={toggleTimer}
            activeOpacity={0.8}
          >
            <MaterialIcons 
              name={isActive ? "pause" : "play-arrow"} 
              size={32} 
              color={isActive ? Colors.primary : Colors.backgroundDark} 
            />
            <Text style={[styles.mainButtonText, isActive && styles.pauseButtonText]}>
              {isActive ? 'Pause' : 'Start Focus'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.resetButton} 
            onPress={resetTimer}
            activeOpacity={0.6}
          >
            <Text style={styles.resetButtonText}>Reset Session</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Quote Section */}
      <View style={[styles.quoteSection, { paddingBottom: insets.bottom + 32 }]}>
        <Text style={styles.quoteText}>
          {"\"For the disciplined mind, there is no such thing as a distraction.\""}
        </Text>
        <Text style={styles.quoteAuthor}>— Wisdom of the Sages</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundDark,
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 20,
  },
  navTitle: {
    fontFamily: Typography.display.join(','),
    fontSize: 14,
    color: `${Colors.textLight}99`,
    fontWeight: '600',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  navSpacer: {
    width: 24,
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 64,
  },
  header: {
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontFamily: Typography.serif.join(','),
    fontSize: 32,
    fontWeight: '700',
    color: Colors.textLight,
  },
  subtitle: {
    fontFamily: Typography.display.join(','),
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    maxWidth: 240,
  },
  timerContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 32,
  },
  timerCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 1,
    borderColor: `${Colors.primary}33`,
    backgroundColor: `${Colors.primary}05`,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.lg,
  },
  timerText: {
    fontFamily: Typography.display.join(','),
    fontSize: 48,
    fontWeight: '700',
    color: Colors.textLight,
    letterSpacing: 4,
  },
  timerLabel: {
    fontFamily: Typography.display.join(','),
    fontSize: 10,
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: 4,
  },
  progressBarBg: {
    width: '100%',
    height: 4,
    backgroundColor: `${Colors.textLight}1A`,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  controls: {
    width: '100%',
    gap: 16,
  },
  mainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    width: '100%',
    height: 64,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.xl,
    ...Shadow.primary,
  },
  mainButtonText: {
    fontFamily: Typography.display.join(','),
    fontSize: 18,
    fontWeight: '700',
    color: Colors.backgroundDark,
  },
  pauseButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: `${Colors.primary}4D`,
  },
  pauseButtonText: {
    color: Colors.primary,
  },
  resetButton: {
    alignItems: 'center',
    padding: 8,
  },
  resetButtonText: {
    fontFamily: Typography.display.join(','),
    fontSize: 12,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  quoteSection: {
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  quoteText: {
    fontFamily: Typography.display.join(','),
    fontSize: 14,
    color: `${Colors.textLight}99`,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 22,
  },
  quoteAuthor: {
    fontFamily: Typography.display.join(','),
    fontSize: 11,
    color: Colors.primary,
    marginTop: 8,
    fontWeight: '600',
  },
});

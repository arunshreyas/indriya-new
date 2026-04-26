import { BorderRadius, Colors, Shadow, Typography } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Animated, Easing } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function FocusTrainingScreen() {
  const insets = useSafeAreaInsets();
  const [isActive, setIsActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    let breathInterval: NodeJS.Timeout;
    
    if (isActive) {
      const runBreathCycle = () => {
        // Inhale (4s)
        setBreathPhase('Inhale');
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1.5,
            duration: 4000,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 4000,
            useNativeDriver: true,
          }),
        ]).start();

        breathInterval = setTimeout(() => {
          // Hold (4s)
          setBreathPhase('Hold');
          
          breathInterval = setTimeout(() => {
            // Exhale (4s)
            setBreathPhase('Exhale');
            Animated.parallel([
              Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 4000,
                easing: Easing.in(Easing.ease),
                useNativeDriver: true,
              }),
              Animated.timing(opacityAnim, {
                toValue: 0.6,
                duration: 4000,
                useNativeDriver: true,
              }),
            ]).start();

            breathInterval = setTimeout(runBreathCycle, 4000);
          }, 4000);
        }, 4000);
      };

      runBreathCycle();
    } else {
      scaleAnim.setValue(1);
      opacityAnim.setValue(0.6);
      setBreathPhase('Inhale');
    }

    return () => {
      if (breathInterval) clearTimeout(breathInterval);
      scaleAnim.stopAnimation();
      opacityAnim.stopAnimation();
    };
  }, [isActive]);

  const toggleTraining = () => {
    setIsActive(!isActive);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Top Navigation */}
      <View style={styles.topNav}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back-ios" size={24} color={Colors.textMuted} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Focus Training</Text>
        <View style={styles.navSpacer} />
      </View>

      <View style={styles.mainContent}>
        <View style={styles.trainingHeader}>
          <Text style={styles.trainingTitle}>Pranayama</Text>
          <Text style={styles.trainingSubtitle}>Master your breath to master your mind</Text>
        </View>

        {/* Breath Visualizer */}
        <View style={styles.visualizerContainer}>
          <Animated.View 
            style={[
              styles.breathCircle, 
              { 
                transform: [{ scale: scaleAnim }],
                opacity: opacityAnim,
              }
            ]} 
          />
          <View style={styles.labelContainer}>
            <Text style={styles.breathLabel}>{isActive ? breathPhase : 'Ready?'}</Text>
            {isActive && <Text style={styles.subLabel}>Box Breathing</Text>}
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.actionButton, isActive && styles.stopButton]} 
          onPress={toggleTraining}
          activeOpacity={0.8}
        >
          <Text style={[styles.actionButtonText, isActive && styles.stopButtonText]}>
            {isActive ? 'Stop Session' : 'Begin Training'}
          </Text>
          <MaterialIcons 
            name={isActive ? "stop" : "play-arrow"} 
            size={24} 
            color={isActive ? Colors.primary : Colors.backgroundDark} 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.instructions}>
        <View style={styles.instructionItem}>
          <MaterialIcons name="filter-center-focus" size={20} color={Colors.primary} />
          <Text style={styles.instructionText}>Keep your eyes fixed on the center circle.</Text>
        </View>
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
  trainingHeader: {
    alignItems: 'center',
    gap: 8,
  },
  trainingTitle: {
    fontFamily: Typography.serif.join(','),
    fontSize: 32,
    fontWeight: '700',
    color: Colors.textLight,
  },
  trainingSubtitle: {
    fontFamily: Typography.display.join(','),
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  visualizerContainer: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  breathCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: `${Colors.primary}33`,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  labelContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  breathLabel: {
    fontFamily: Typography.serif.join(','),
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  subLabel: {
    fontFamily: Typography.display.join(','),
    fontSize: 10,
    color: Colors.primary,
    marginTop: 4,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  actionButton: {
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
  actionButtonText: {
    fontFamily: Typography.display.join(','),
    fontSize: 18,
    fontWeight: '700',
    color: Colors.backgroundDark,
  },
  stopButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: `${Colors.primary}4D`,
  },
  stopButtonText: {
    color: Colors.primary,
  },
  instructions: {
    padding: 32,
    paddingBottom: 48,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: `${Colors.textLight}05`,
    padding: 16,
    borderRadius: BorderRadius.lg,
  },
  instructionText: {
    fontFamily: Typography.display.join(','),
    fontSize: 13,
    color: Colors.textMuted,
    flex: 1,
  },
});

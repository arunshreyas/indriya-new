import { BorderRadius, Colors, Shadow, Typography } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();

  const handleGoogleSignIn = () => {
    // TODO: Implement Google Sign-In
    router.push('/onboarding');
  };

  const handleEmailSignIn = () => {
    // TODO: Implement Email Sign-In
    router.push('/onboarding');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Background Decorative Elements */}
      <View style={styles.backgroundDecoration}>
        <View style={[styles.decorativeCircle, styles.topRight]} />
        <View style={[styles.decorativeCircle, styles.bottomLeft]} />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <View style={styles.logoInner}>
              <MaterialIcons 
                name="self-improvement" 
                size={48} 
                color={Colors.primary} 
              />
            </View>
          </View>
          
          <View style={styles.titleSection}>
            <Text style={styles.title}>Welcome to Indriya</Text>
            <Text style={styles.subtitle}>
              A private early-access experience for discipline and self-mastery.
            </Text>
          </View>
        </View>

        {/* Visual Accent */}
        <View style={styles.visualAccent}>
          <View style={styles.concentricCircles}>
            <View style={[styles.circle, styles.outerCircle]} />
            <View style={[styles.circle, styles.middleCircle]} />
            <View style={[styles.circle, styles.innerCircle]} />
          </View>
        </View>

        {/* Auth Buttons */}
        <View style={styles.authSection}>
          <TouchableOpacity 
            style={[styles.authButton, styles.googleButton]}
            onPress={handleGoogleSignIn}
            activeOpacity={0.8}
          >
            <View style={styles.googleIcon}>
              {/* Google SVG would go here - using MaterialIcons as placeholder */}
              <MaterialIcons name="search" size={20} color="#4285F4" />
            </View>
            <Text style={[styles.authButtonText, styles.googleButtonText]}>
              Continue with Google
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.authButton, styles.emailButton]}
            onPress={handleEmailSignIn}
            activeOpacity={0.8}
          >
            <MaterialIcons 
              name="mail-outline" 
              size={20} 
              color={Colors.textMuted} 
            />
            <Text style={styles.authButtonText}>
              Continue with Email
            </Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              No ads • Minimal data • Demo access
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundDark,
    width: '100%',
    height: '100%',
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
    borderRadius: 9999,
  },
  topRight: {
    top: '-10%',
    right: '-10%',
    width: '50%',
    height: '40%',
    backgroundColor: `${Colors.primary}10`,
    borderRadius: 9999,
    filter: 'blur(120px)',
  },
  bottomLeft: {
    bottom: '-10%',
    left: '-10%',
    width: '50%',
    height: '40%',
    backgroundColor: '#0000ff10',
    borderRadius: 9999,
    filter: 'blur(120px)',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 12,
    justifyContent: 'space-between',
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  logoSection: {
    alignItems: 'center',
    marginTop: 48,
  },
  logoContainer: {
    position: 'relative',
  },
  logoInner: {
    backgroundColor: Colors.backgroundDark,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    borderRadius: BorderRadius.full,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleSection: {
    marginTop: 24,
    alignItems: 'center',
  },
  title: {
    fontFamily: Typography.serif.join(','),
    fontSize: 36,
    fontWeight: '700',
    color: Colors.textLight,
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: Typography.display.join(','),
    fontSize: 16,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 280,
    fontWeight: '300',
  },
  visualAccent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  concentricCircles: {
    width: Math.min(width * 0.8, 320),
    aspectRatio: 1,
    position: 'relative',
    opacity: 0.2,
  },
  circle: {
    position: 'absolute',
    borderRadius: BorderRadius.full,
    borderWidth: 0.5,
    borderColor: Colors.borderDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerCircle: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  middleCircle: {
    top: '12.5%',
    left: '12.5%',
    right: '12.5%',
    bottom: '12.5%',
  },
  innerCircle: {
    top: '25%',
    left: '25%',
    right: '25%',
    bottom: '25%',
  },
  authSection: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    gap: 16,
    paddingBottom: 32,
  },
  authButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderRadius: BorderRadius.xl,
    height: 56,
    paddingHorizontal: 24,
  },
  googleButton: {
    backgroundColor: Colors.backgroundLight,
    ...Shadow.sm,
  },
  emailButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  googleIcon: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  authButtonText: {
    fontFamily: Typography.display.join(','),
    fontSize: 16,
    fontWeight: '600',
  },
  googleButtonText: {
    color: Colors.charcoal,
  },
  footer: {
    paddingTop: 24,
    paddingBottom: 8,
    alignItems: 'center',
  },
  footerText: {
    fontFamily: Typography.display.join(','),
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '500',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});

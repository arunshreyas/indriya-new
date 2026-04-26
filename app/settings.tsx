import { BorderRadius, Colors, Typography } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SettingItem {
  id: string;
  title: string;
  icon: string;
  type: 'toggle' | 'action';
  value?: boolean;
  onPress?: () => void;
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const [dailyReminders, setDailyReminders] = React.useState(true);
  const [silentMode, setSilentMode] = React.useState(false);

  const settings: SettingItem[] = [
    {
      id: 'daily-reminders',
      title: 'Daily Reminders',
      icon: 'notifications',
      type: 'toggle',
      value: dailyReminders,
      onPress: () => setDailyReminders(!dailyReminders),
    },
    {
      id: 'silent-mode',
      title: 'Silent Mode',
      icon: 'volume-off',
      type: 'toggle',
      value: silentMode,
      onPress: () => setSilentMode(!silentMode),
    },
  ];

  const handleSignOut = () => {
    // TODO: Implement sign out functionality
    console.log('Sign out pressed');
    router.replace('/welcome');
  };

  const handlePrivacyPolicy = () => {
    // TODO: Open privacy policy
    console.log('Privacy policy pressed');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Top Navigation Bar */}
      <View style={styles.topNav}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back-ios" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Settings</Text>
        <View style={styles.navSpacer} />
      </View>

      {/* Main Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* App Logo/Branding Header */}
        <View style={styles.brandingSection}>
          <View style={styles.logoContainer}>
            <MaterialIcons 
              name="self-improvement" 
              size={32} 
              color={Colors.primary}
            />
          </View>
          <Text style={styles.brandName}>Indriya</Text>
        </View>

        {/* PREFERENCES SECTION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.sectionContent}>
            {settings.map((item) => (
              <View key={item.id} style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <View style={styles.iconContainer}>
                    <MaterialIcons 
                      name={item.icon as any} 
                      size={20} 
                      color={`${Colors.primary}CC`} // 80% opacity
                    />
                  </View>
                  <Text style={styles.settingTitle}>{item.title}</Text>
                </View>
                <View style={styles.settingRight}>
                  {item.type === 'toggle' && (
                    <TouchableOpacity onPress={item.onPress}>
                      <View style={styles.switchContainer}>
                        <View style={[
                          styles.switchTrack,
                          item.value && styles.switchTrackActive
                        ]} />
                        <View style={[
                          styles.switchThumb,
                          item.value && styles.switchThumbActive
                        ]} />
                      </View>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* PRIVACY SECTION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          <View style={styles.sectionContent}>
            <View style={styles.privacyContent}>
              <Text style={styles.privacyQuote}>
                {'"No ads. No tracking. Minimal data storage."'}
              </Text>
              <Text style={styles.privacyDescription}>
                Your practice is sacred. We believe sensory mastery requires digital peace. 
                Your data never leaves this device unless synced.
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.privacyLink}
              onPress={handlePrivacyPolicy}
              activeOpacity={0.8}
            >
              <Text style={styles.privacyLinkText}>Privacy Policy</Text>
              <MaterialIcons 
                name="open-in-new" 
                size={16} 
                color={Colors.primary}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* ACCOUNT SECTION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.sectionContent}>
            <View style={styles.accountItem}>
              <View style={styles.accountInfo}>
                <Text style={styles.accountLabel}>Method</Text>
                <Text style={styles.accountValue}>Logged in via Apple</Text>
              </View>
              <MaterialIcons 
                name="apple" 
                size={20} 
                color={Colors.textMuted}
              />
            </View>
            <View style={styles.divider} />
            <TouchableOpacity 
              style={styles.signOutButton}
              onPress={handleSignOut}
              activeOpacity={0.8}
            >
              <View style={styles.signOutIconContainer}>
                <MaterialIcons 
                  name="logout" 
                  size={20} 
                  color={Colors.error}
                />
              </View>
              <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer Info */}
        <View style={styles.footer}>
          <Text style={styles.versionText}>Indriya Version 1.2.0 (Stable)</Text>
          <View style={styles.certification}>
            <View style={styles.certBorder}>
              <View style={styles.certContent}>
                <Text style={styles.certText}>CERTIFIED MINIMALIST</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* iOS Bottom Indicator */}
      <View style={styles.bottomIndicator} />
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
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: `${Colors.backgroundDark}F2`, // 95% opacity
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDark,
  },
  navTitle: {
    flex: 1,
    textAlign: 'center',
    fontFamily: Typography.display.join(','),
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: -0.5,
    color: Colors.textLight,
    paddingRight: 32,
  },
  navSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  brandingSection: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.full,
    backgroundColor: `${Colors.primary}1A`, // 10% opacity
    borderWidth: 1,
    borderColor: `${Colors.primary}4D}`, // 30% opacity
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  brandName: {
    fontFamily: Typography.display.join(','),
    fontSize: 12,
    fontWeight: '500',
    color: `${Colors.primary}B3}`, // 70% opacity
    letterSpacing: 3.2,
    textTransform: 'uppercase',
  },
  section: {
    marginTop: 32,
  },
  sectionTitle: {
    fontFamily: Typography.display.join(','),
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 2.4,
    textTransform: 'uppercase',
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  sectionContent: {
    backgroundColor: Colors.surfaceDark,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: Colors.borderDark,
    borderBottomColor: Colors.borderDark,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
    minHeight: 60,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.lg,
    backgroundColor: `${Colors.primary}1A`, // 10% opacity
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingTitle: {
    fontFamily: Typography.display.join(','),
    fontSize: 15,
    fontWeight: '400',
    color: Colors.textLight,
    lineHeight: 20,
  },
  settingRight: {
    marginLeft: 16,
  },
  switchContainer: {
    position: 'relative',
    width: 44,
    height: 26,
  },
  switchTrack: {
    position: 'absolute',
    top: 2,
    left: 2,
    width: 40,
    height: 22,
    borderRadius: BorderRadius.full,
    backgroundColor: '#71717A', // stone-700
  },
  switchTrackActive: {
    backgroundColor: Colors.primary,
  },
  switchThumb: {
    position: 'absolute',
    top: 2,
    left: 2,
    width: 22,
    height: 22,
    borderRadius: BorderRadius.full,
    backgroundColor: '#FFFFFF',
    transform: [{ translateX: 0 }],
  },
  switchThumbActive: {
    transform: [{ translateX: 18 }],
  },
  privacyContent: {
    flexDirection: 'column',
    gap: 8,
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
  privacyQuote: {
    fontFamily: Typography.display.join(','),
    fontSize: 14,
    color: Colors.textLight,
    lineHeight: 22,
    fontStyle: 'italic',
    fontWeight: '300',
  },
  privacyDescription: {
    fontFamily: Typography.display.join(','),
    fontSize: 13,
    color: Colors.textMuted,
    lineHeight: 20,
  },
  privacyLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 16,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  privacyLinkText: {
    fontFamily: Typography.display.join(','),
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
  },
  accountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
    minHeight: 60,
  },
  accountInfo: {
    flexDirection: 'column',
    gap: 2,
  },
  accountLabel: {
    fontFamily: Typography.display.join(','),
    fontSize: 13,
    color: Colors.textMuted,
  },
  accountValue: {
    fontFamily: Typography.display.join(','),
    fontSize: 15,
    fontWeight: '400',
    color: Colors.textLight,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderDark,
    marginHorizontal: 24,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 24,
    paddingVertical: 20,
    minHeight: 60,
    backgroundColor: 'transparent',
  },
  signOutIconContainer: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.lg,
    backgroundColor: `${Colors.error}1A}`, // 10% opacity
    alignItems: 'center',
    justifyContent: 'center',
  },
  signOutText: {
    fontFamily: Typography.display.join(','),
    fontSize: 15,
    fontWeight: '400',
    color: Colors.error,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  versionText: {
    fontFamily: Typography.display.join(','),
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: Colors.textMuted,
    marginBottom: 16,
  },
  certification: {
    opacity: 0.3,
    filter: 'grayscale(1)',
  },
  certBorder: {
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    padding: 4,
    borderRadius: BorderRadius.sm,
  },
  certContent: {
    backgroundColor: `${Colors.primary}14}`, // 8% opacity
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  certText: {
    fontFamily: Typography.display.join(','),
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: Colors.primary,
  },
  bottomIndicator: {
    position: 'absolute',
    bottom: 4,
    left: '50%',
    transform: [{ translateX: -64 }],
    width: 128,
    height: 6,
    backgroundColor: `${Colors.textLight}1A}`, // 10% opacity
    borderRadius: BorderRadius.full,
  },
});

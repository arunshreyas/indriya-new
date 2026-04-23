import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, BorderRadius, Shadow } from '@/constants/theme';
import { router } from 'expo-router';

interface Verse {
  id: string;
  number: string;
  sanskrit: string;
  translation: string;
}

const verses: Verse[] = [
  {
    id: '2.2',
    number: 'VERSE 2.2',
    sanskrit: 'श्रीभगवानुवाच |\nकुतस्त्वा कश्मलमिदं विषमे समुपस्थितम् ||',
    translation: 'The Supreme Lord said: My dear Arjuna, how have these impurities come upon you? They are not at all befitting a man who knows the value of life.',
  },
  {
    id: '2.3',
    number: 'VERSE 2.3',
    sanskrit: 'क्लैब्यं मा स्म गमः पार्थ नैतत्त्वय्युपपद्यते |\nक्षुद्रं हृदयदौर्बल्यं त्यक्त्वोत्तिष्ठ परन्तप ||',
    translation: 'O son of Pritha, do not yield to this degrading impotence. It does not become you. Give up such petty weakness of heart and arise, O chastiser of the enemy.',
  },
  {
    id: '2.4',
    number: 'VERSE 2.4',
    sanskrit: 'कथं भीष्ममहं संख्ये द्रोणं च मधुसूदन ...',
    translation: '',
  },
];

export default function GitaReadingScreen() {
  const insets = useSafeAreaInsets();
  const [inputText, setInputText] = React.useState('');
  const scrollViewRef = React.useRef<ScrollView>(null);

  const handleAskQuestion = () => {
    // TODO: Implement AI chat functionality
    console.log('Ask question:', inputText);
    setInputText('');
  };

  const handleQuickQuestion = (question: string) => {
    // TODO: Implement quick question functionality
    console.log('Quick question:', question);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Top AppBar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.textLight} />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.subtitle}>Wisdom</Text>
          <Text style={styles.title}>Chapter 2: Sāṅkhya Yoga</Text>
        </View>
        <TouchableOpacity>
          <MaterialIcons name="text-fields" size={24} color={Colors.textLight} />
        </TouchableOpacity>
      </View>

      {/* Reading Content */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {verses.map((verse, index) => (
          <View key={verse.id} style={styles.verseBlock}>
            <View style={styles.verseContent}>
              <Text style={styles.verseNumber}>{verse.number}</Text>
              <Text style={styles.sanskritText}>{verse.sanskrit}</Text>
              <Text style={styles.translationText}>{verse.translation}</Text>
            </View>

            {/* Divider */}
            {index < verses.length - 1 && (
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <View style={styles.dividerDot} />
                <View style={styles.dividerLine} />
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* AI Bottom Sheet & FAB Overlay */}
      <View style={styles.bottomOverlay}>
        <View style={styles.bottomSheetContainer}>
          {/* AI Sparkle FAB */}
          <TouchableOpacity style={styles.fabButton}>
            <MaterialIcons 
              name="auto-awesome" 
              size={28} 
              color={Colors.backgroundDark}
              style={styles.fabIcon}
            />
          </TouchableOpacity>

          {/* Bottom Sheet */}
          <View style={styles.bottomSheet}>
            <View style={styles.sheetHandle} />
            <View style={styles.sheetContent}>
              <View style={styles.aiHeader}>
                <View style={styles.aiIconContainer}>
                  <MaterialIcons 
                    name="psychology" 
                    size={16} 
                    color={Colors.primary}
                  />
                </View>
                <Text style={styles.aiHeaderText}>Guided Insight</Text>
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Ask Krishna about this verse..."
                  placeholderTextColor={Colors.textMuted}
                  value={inputText}
                  onChangeText={setInputText}
                  multiline={false}
                />
                <TouchableOpacity 
                  style={styles.sendButton}
                  onPress={handleAskQuestion}
                  activeOpacity={0.8}
                >
                  <MaterialIcons 
                    name="arrow-upward" 
                    size={16} 
                    color={Colors.backgroundDark}
                  />
                </TouchableOpacity>
              </View>

              {/* Quick Questions */}
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.quickQuestions}
                contentContainerStyle={styles.quickQuestionsContainer}
              >
                <TouchableOpacity 
                  style={styles.quickQuestionButton}
                  onPress={() => handleQuickQuestion("Explain 'Dharma'")}
                  activeOpacity={0.8}
                >
                  <Text style={styles.quickQuestionText}>Explain 'Dharma'</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.quickQuestionButton}
                  onPress={() => handleQuickQuestion("Why is Arjuna sad?")}
                  activeOpacity={0.8}
                >
                  <Text style={styles.quickQuestionText}>Why is Arjuna sad?</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.quickQuestionButton}
                  onPress={() => handleQuickQuestion("Apply to modern life")}
                  activeOpacity={0.8}
                >
                  <Text style={styles.quickQuestionText}>Apply to modern life</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </View>
      </View>

      {/* Bottom Navigation */}
      <View style={[styles.bottomNav, { paddingBottom: insets.bottom }]}>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="home" size={24} color={Colors.textMuted} />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="self-improvement" size={24} color={Colors.textMuted} />
          <Text style={styles.navText}>Practice</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.activeNavItem]}>
          <MaterialIcons name="menu-book" size={24} color={Colors.primary} />
          <Text style={[styles.navText, styles.activeNavText]}>Wisdom</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="person" size={24} color={Colors.textMuted} />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundDark,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: `${Colors.backgroundDark}E6`, // 90% opacity
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  subtitle: {
    fontFamily: Typography.newsreader.join(','),
    fontSize: 14,
    color: `${Colors.textLight}99`, // 60% opacity
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 3.2,
  },
  title: {
    fontFamily: Typography.newsreader.join(','),
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textLight,
    lineHeight: 22,
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    paddingBottom: 200, // Space for bottom sheet
  },
  verseBlock: {
    marginBottom: 48,
  },
  verseContent: {
    alignItems: 'center',
    gap: 24,
  },
  verseNumber: {
    fontFamily: Typography.newsreader.join(','),
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  sanskritText: {
    fontFamily: Typography.newsreader.join(','),
    fontSize: 28,
    fontWeight: '700',
    color: `${Colors.primary}E6`, // 90% opacity
    lineHeight: 34,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  translationText: {
    fontFamily: Typography.newsreader.join(','),
    fontSize: 18,
    fontWeight: '400',
    color: `${Colors.textLight}E6`, // 90% opacity
    lineHeight: 32,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  divider: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    opacity: 0.2,
    marginVertical: 48,
  },
  dividerLine: {
    height: 1,
    width: 48,
    backgroundColor: Colors.primary,
  },
  dividerDot: {
    width: 6,
    height: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 40,
    pointerEvents: 'none',
  },
  bottomSheetContainer: {
    maxWidth: 448,
    width: '100%',
    height: '100%',
    alignSelf: 'center',
    position: 'relative',
  },
  fabButton: {
    position: 'absolute',
    bottom: 96,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.md,
    pointerEvents: 'auto',
  },
  fabIcon: {
    fontWeight: '700',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.charcoal,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
    paddingTop: 8,
    paddingBottom: 24,
    paddingHorizontal: 16,
    pointerEvents: 'auto',
  },
  sheetHandle: {
    width: 48,
    height: 4,
    backgroundColor: `${Colors.textLight}1A`, // 10% opacity
    borderRadius: BorderRadius.full,
    alignSelf: 'center',
    marginBottom: 16,
  },
  sheetContent: {
    gap: 16,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 8,
  },
  aiIconContainer: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: `${Colors.primary}33`, // 20% opacity
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiHeaderText: {
    fontFamily: Typography.newsreader.join(','),
    fontSize: 14,
    fontWeight: '500',
    color: `${Colors.primary}CC`, // 80% opacity
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.textLight}0D`, // 5% opacity
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: BorderRadius.full,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  textInput: {
    flex: 1,
    fontFamily: Typography.display.join(','),
    fontSize: 16,
    color: Colors.textLight,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickQuestions: {
    marginTop: 8,
  },
  quickQuestionsContainer: {
    gap: 8,
    paddingHorizontal: 4,
  },
  quickQuestionButton: {
    backgroundColor: `${Colors.textLight}0D`, // 5% opacity
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: BorderRadius.full,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  quickQuestionText: {
    fontFamily: Typography.display.join(','),
    fontSize: 12,
    color: `${Colors.textLight}B3`, // 70% opacity
    whiteSpace: 'nowrap',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: Colors.backgroundDark,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  navItem: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    opacity: 0.5,
  },
  activeNavItem: {
    opacity: 1,
  },
  navText: {
    fontFamily: Typography.display.join(','),
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  activeNavText: {
    color: Colors.primary,
  },
});

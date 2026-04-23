import { BorderRadius, Colors, Shadow, Typography } from '@/constants/theme';
import { Chapter, gitaApi } from '@/services/gitaApi';
import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    KeyboardAvoidingView,
    PanResponder,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface DisplayVerse {
  id: string;
  verseNumber: number;
  sanskrit: string;
  translation: string;
}

export default function GitaReadingScreen() {
  const insets = useSafeAreaInsets();
  const { chapter } = useLocalSearchParams<{ chapter?: string }>();
  const chapterNumber = chapter ? parseInt(chapter, 10) : 1;

  const [chapterInfo, setChapterInfo] = React.useState<Chapter | null>(null);
  const [verses, setVerses] = React.useState<DisplayVerse[]>([]);
  const [currentVerseIndex, setCurrentVerseIndex] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [aiExpanded, setAiExpanded] = React.useState(false);
  const [inputText, setInputText] = React.useState('');

  // Animation values
  const slideAnim = React.useRef(new Animated.Value(0)).current;
  const aiHeightAnim = React.useRef(new Animated.Value(60)).current;
  const aiOpacityAnim = React.useRef(new Animated.Value(0.7)).current;

  React.useEffect(() => {
    loadChapterData();
  }, [chapterNumber]);

  const loadChapterData = async () => {
    try {
      setLoading(true);
      const [chapterData, versesData] = await Promise.all([
        gitaApi.getChapter(chapterNumber),
        gitaApi.getVerses(chapterNumber)
      ]);

      setChapterInfo(chapterData);

      const displayVerses: DisplayVerse[] = versesData.map((verse) => {
        const englishTranslation = verse.translations.find(
          t => t.language === 'en'
        )?.description || 'Translation not available';

        return {
          id: verse.id,
          verseNumber: verse.verse_number,
          sanskrit: verse.text,
          translation: englishTranslation,
        };
      });

      setVerses(displayVerses);
      setCurrentVerseIndex(0);
    } catch (error) {
      console.error('Failed to load chapter data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Swipe gesture handler
  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 20;
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -50 && currentVerseIndex < verses.length - 1) {
          // Swipe left - next verse
          goToNextVerse();
        } else if (gestureState.dx > 50 && currentVerseIndex > 0) {
          // Swipe right - previous verse
          goToPreviousVerse();
        }
      },
    })
  ).current;

  const goToNextVerse = () => {
    if (currentVerseIndex < verses.length - 1) {
      Animated.timing(slideAnim, {
        toValue: -SCREEN_WIDTH,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setCurrentVerseIndex(prev => prev + 1);
        slideAnim.setValue(SCREEN_WIDTH);
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
      });
    }
  };

  const goToPreviousVerse = () => {
    if (currentVerseIndex > 0) {
      Animated.timing(slideAnim, {
        toValue: SCREEN_WIDTH,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setCurrentVerseIndex(prev => prev - 1);
        slideAnim.setValue(-SCREEN_WIDTH);
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
      });
    }
  };

  const toggleAiOverlay = () => {
    if (aiExpanded) {
      // Collapse
      Animated.parallel([
        Animated.timing(aiHeightAnim, {
          toValue: 60,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(aiOpacityAnim, {
          toValue: 0.7,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Expand
      Animated.parallel([
        Animated.timing(aiHeightAnim, {
          toValue: 280,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(aiOpacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
    setAiExpanded(!aiExpanded);
  };

  const handleAskQuestion = () => {
    console.log('Ask about verse', currentVerseIndex + 1, ':', inputText);
    setInputText('');
  };

  const currentVerse = verses[currentVerseIndex];

  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading chapter {chapterNumber}...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Book Header */}
      <View style={styles.bookHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={20} color={Colors.textMuted} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.chapterName}>{chapterInfo?.name_transliterated}</Text>
          <Text style={styles.chapterSubtitle}>{chapterInfo?.name_translated}</Text>
        </View>
        <View style={styles.verseCounter}>
          <Text style={styles.verseCounterText}>
            {currentVerseIndex + 1} / {verses.length}
          </Text>
        </View>
      </View>

      {/* Book Content - Swipeable Area */}
      <View style={styles.bookContainer} {...panResponder.panHandlers}>
        {/* Page edges decoration */}
        <View style={styles.pageLeftEdge} />
        <View style={styles.pageRightEdge} />

        {/* Main content */}
        <Animated.View
          style={[
            styles.pageContent,
            { transform: [{ translateX: slideAnim }] }
          ]}
        >
          {currentVerse && (
            <>
              {/* Verse Number */}
              <View style={styles.verseNumberContainer}>
                <Text style={styles.verseNumber}>Verse {currentVerse.verseNumber}</Text>
                <View style={styles.verseNumberLine} />
              </View>

              {/* Sanskrit Text */}
              <Text style={styles.sanskritText}>{currentVerse.sanskrit}</Text>

              {/* Translation */}
              <View style={styles.translationContainer}>
                <Text style={styles.translationLabel}>Translation</Text>
                <Text style={styles.translationText}>{currentVerse.translation}</Text>
              </View>
            </>
          )}
        </Animated.View>

        {/* Navigation Hints */}
        {currentVerseIndex > 0 && (
          <View style={styles.swipeHintLeft}>
            <MaterialIcons name="chevron-left" size={32} color={Colors.textMuted} />
          </View>
        )}
        {currentVerseIndex < verses.length - 1 && (
          <View style={styles.swipeHintRight}>
            <MaterialIcons name="chevron-right" size={32} color={Colors.textMuted} />
          </View>
        )}
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${((currentVerseIndex + 1) / verses.length) * 100}%` }
            ]}
          />
        </View>
      </View>

      {/* AI Mini Overlay */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[styles.aiContainer, { bottom: insets.bottom + 16 }]}
      >
        <Animated.View
          style={[
            styles.aiOverlay,
            {
              height: aiHeightAnim,
              opacity: aiOpacityAnim,
            }
          ]}
        >
          {/* Mini Header - Always visible */}
          <TouchableOpacity
            style={styles.aiHeader}
            onPress={toggleAiOverlay}
            activeOpacity={0.8}
          >
            <View style={styles.aiIconContainer}>
              <MaterialIcons name="auto-awesome" size={16} color={Colors.primary} />
            </View>
            <Text style={styles.aiHeaderText}>Guided Insight</Text>
            <MaterialIcons
              name={aiExpanded ? "expand-more" : "expand-less"}
              size={20}
              color={Colors.textMuted}
            />
          </TouchableOpacity>

          {/* Expanded Content */}
          {aiExpanded && (
            <View style={styles.aiExpandedContent}>
              <Text style={styles.aiContextText}>
                Ask about Verse {currentVerse?.verseNumber}
              </Text>

              <View style={styles.aiInputContainer}>
                <TextInput
                  style={styles.aiTextInput}
                  placeholder="Ask Krishna..."
                  placeholderTextColor={Colors.textMuted}
                  value={inputText}
                  onChangeText={setInputText}
                  multiline={false}
                />
                <TouchableOpacity
                  style={styles.aiSendButton}
                  onPress={handleAskQuestion}
                >
                  <MaterialIcons name="send" size={16} color={Colors.backgroundDark} />
                </TouchableOpacity>
              </View>

              {/* Quick Questions */}
              <View style={styles.quickQuestionsContainer}>
                <TouchableOpacity style={styles.quickQuestionChip}>
                  <Text style={styles.quickQuestionText}>Explain meaning</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.quickQuestionChip}>
                  <Text style={styles.quickQuestionText}>Modern context</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.quickQuestionChip}>
                  <Text style={styles.quickQuestionText}>Sanskrit word</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundDark,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: Typography.display.join(','),
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 16,
  },

  // Book Header
  bookHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    backgroundColor: `${Colors.textLight}0A`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  chapterName: {
    fontFamily: Typography.devanagari.join(','),
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    textAlign: 'center',
  },
  chapterSubtitle: {
    fontFamily: Typography.display.join(','),
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
    textAlign: 'center',
  },
  verseCounter: {
    backgroundColor: `${Colors.primary}1A`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  verseCounterText: {
    fontFamily: Typography.display.join(','),
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },

  // Book Container
  bookContainer: {
    flex: 1,
    margin: 16,
    backgroundColor: `${Colors.textLight}05`,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    overflow: 'hidden',
    position: 'relative',
  },
  pageLeftEdge: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: `${Colors.primary}33`,
  },
  pageRightEdge: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: `${Colors.primary}1A`,
  },
  pageContent: {
    flex: 1,
    padding: 24,
    paddingTop: 32,
  },

  // Swipe Hints
  swipeHintLeft: {
    position: 'absolute',
    left: 8,
    top: '50%',
    transform: [{ translateY: -16 }],
    opacity: 0.3,
  },
  swipeHintRight: {
    position: 'absolute',
    right: 8,
    top: '50%',
    transform: [{ translateY: -16 }],
    opacity: 0.3,
  },

  // Verse Content
  verseNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  verseNumber: {
    fontFamily: Typography.display.join(','),
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginRight: 12,
  },
  verseNumberLine: {
    flex: 1,
    height: 1,
    backgroundColor: `${Colors.primary}4D`,
  },
  sanskritText: {
    fontFamily: Typography.devanagari.join(','),
    fontSize: 24,
    fontWeight: '600',
    color: Colors.textLight,
    lineHeight: 36,
    textAlign: 'center',
    marginBottom: 32,
  },
  translationContainer: {
    backgroundColor: `${Colors.textLight}0A`,
    borderRadius: BorderRadius.lg,
    padding: 20,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  translationLabel: {
    fontFamily: Typography.display.join(','),
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  translationText: {
    fontFamily: Typography.display.join(','),
    fontSize: 15,
    color: Colors.textLight,
    lineHeight: 24,
    fontStyle: 'italic',
  },

  // Progress
  progressContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  progressBar: {
    height: 3,
    backgroundColor: Colors.borderLight,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
  },

  // AI Overlay
  aiContainer: {
    position: 'absolute',
    left: 16,
    right: 16,
  },
  aiOverlay: {
    backgroundColor: Colors.charcoal,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    overflow: 'hidden',
    ...Shadow.md,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 60,
  },
  aiIconContainer: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: `${Colors.primary}1A`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiHeaderText: {
    fontFamily: Typography.display.join(','),
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textLight,
    flex: 1,
    marginLeft: 12,
  },
  aiExpandedContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  aiContextText: {
    fontFamily: Typography.display.join(','),
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 12,
  },
  aiInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.textLight}0A`,
    borderRadius: BorderRadius.full,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 12,
  },
  aiTextInput: {
    flex: 1,
    fontFamily: Typography.display.join(','),
    fontSize: 14,
    color: Colors.textLight,
    paddingVertical: 12,
  },
  aiSendButton: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickQuestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickQuestionChip: {
    backgroundColor: `${Colors.primary}1A`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: `${Colors.primary}33`,
  },
  quickQuestionText: {
    fontFamily: Typography.display.join(','),
    fontSize: 12,
    color: Colors.primary,
  },
});

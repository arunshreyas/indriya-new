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
    ScrollView,
    FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { openRouterService, Message } from '@/services/openRouter';

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
  const [aiResponse, setAiResponse] = React.useState<string | null>(null);
  const [aiLoading, setAiLoading] = React.useState(false);

  // Animation values
  const slideAnim = React.useRef(new Animated.Value(0)).current;
  const aiHeightAnim = React.useRef(new Animated.Value(56)).current;
  const aiWidthAnim = React.useRef(new Animated.Value(56)).current;
  const aiOpacityAnim = React.useRef(new Animated.Value(0.9)).current;

  const loadChapterData = React.useCallback(async () => {
    try {
      setLoading(true);
      const [chapterData, versesData] = await Promise.all([
        gitaApi.getChapter(chapterNumber),
        gitaApi.getVerses(chapterNumber)
      ]);

      setChapterInfo(chapterData);

      const displayVerses: DisplayVerse[] = versesData.map((verse) => {
        // Find English translation (check both 'en' and 'english' case-insensitive)
        const englishTranslation = verse.translations.find(
          t => t.language.toLowerCase() === 'en' || t.language.toLowerCase() === 'english'
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
  }, [chapterNumber]);

  React.useEffect(() => {
    loadChapterData();
  }, [loadChapterData]);

  // Swipe gesture handler
  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponderCapture: (_, gestureState) => {
        // Only capture horizontal swipes that are clearly horizontal
        return Math.abs(gestureState.dx) > 10 && Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 2;
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 50 && currentVerseIndex > 0) {
          goToPreviousVerse();
        } else if (gestureState.dx < -50 && currentVerseIndex < verses.length - 1) {
          goToNextVerse();
        }
      },
      onPanResponderTerminationRequest: () => false,
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
          toValue: 56,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(aiWidthAnim, {
          toValue: 56,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(aiOpacityAnim, {
          toValue: 0.9,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      // Expand
      Animated.parallel([
        Animated.timing(aiHeightAnim, {
          toValue: 400,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(aiWidthAnim, {
          toValue: SCREEN_WIDTH - 32,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(aiOpacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    }
    setAiExpanded(!aiExpanded);
  };

  const handleAskQuestion = async (predefinedQuestion?: string) => {
    const question = predefinedQuestion || inputText;
    if (!question.trim()) return;

    setAiLoading(true);
    setAiResponse(null);
    setInputText('');

    if (!aiExpanded) {
      toggleAiOverlay();
    }

    try {
      const currentVerse = verses[currentVerseIndex];
      const context = `The user is reading Bhagavad Gita Chapter ${chapterNumber}, Verse ${currentVerse?.verseNumber}.\nSanskrit: ${currentVerse?.sanskrit}\nTranslation: ${currentVerse?.translation}\n\nUser Question: ${question}`;
      
      const messages: Message[] = [
        { role: 'user', content: context, timestamp: Date.now() }
      ];

      const response = await openRouterService.sendMessage(messages);
      setAiResponse(response);
    } catch (error) {
      console.error('Failed to get AI response:', error);
      setAiResponse('Forgive me, but I am unable to connect to the divine source right now. Please try again later.');
    } finally {
      setAiLoading(false);
    }
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
      {/* Book Content - Native Paging Area */}
      <View style={styles.bookContainer}>
        <View style={styles.pageLeftEdge} />
        <View style={styles.pageRightEdge} />

        {verses.length > 0 && (
          <FlatList
            data={verses}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            initialScrollIndex={currentVerseIndex}
            getItemLayout={(_, index) => ({
              length: SCREEN_WIDTH - 32,
              offset: (SCREEN_WIDTH - 32) * index,
              index,
            })}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / (SCREEN_WIDTH - 32));
              if (index !== currentVerseIndex) {
                setCurrentVerseIndex(index);
              }
            }}
            renderItem={({ item: verse }) => (
              <View style={styles.versePage}>
                <ScrollView 
                  style={styles.bookScroll}
                  contentContainerStyle={styles.bookScrollContent}
                  showsVerticalScrollIndicator={false}
                >
                  <View style={styles.verseNumberContainer}>
                    <Text style={styles.verseNumber}>Verse {verse.verseNumber}</Text>
                    <View style={styles.verseNumberLine} />
                  </View>

                  <Text style={styles.sanskritText}>{verse.sanskrit}</Text>

                  <View style={styles.translationContainer}>
                    <Text style={styles.translationLabel}>Translation</Text>
                    <Text style={styles.translationText}>{verse.translation}</Text>
                  </View>
                </ScrollView>
              </View>
            )}
          />
        )}
      </View>

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

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[
          styles.aiContainer, 
          { bottom: insets.bottom + 20, right: 20 },
          aiExpanded && { left: 16, right: 16 }
        ]}
      >
        <Animated.View
          style={[
            styles.aiOverlay,
            {
              height: aiHeightAnim,
              width: aiWidthAnim,
              opacity: aiOpacityAnim,
              borderRadius: aiExpanded ? BorderRadius.xl : 28,
            },
          ]}
        >
          <TouchableOpacity 
            activeOpacity={0.9} 
            onPress={toggleAiOverlay}
            style={[styles.aiHeader, !aiExpanded && styles.aiHeaderCollapsed]}
          >
            <View style={styles.aiTitleRow}>
              <MaterialIcons name="lightbulb" size={aiExpanded ? 20 : 24} color={Colors.primary} />
              {aiExpanded && <Text style={styles.aiTitle}>Guided Insight</Text>}
            </View>
            {aiExpanded && <MaterialIcons name="close" size={20} color={Colors.textMuted} />}
          </TouchableOpacity>

          {aiExpanded && (
            <View style={styles.aiExpandedContent}>
              <Text style={styles.aiContextText}>
                Ask about Verse {currentVerse?.verseNumber}
              </Text>

              {aiLoading ? (
                <View style={styles.aiLoadingContainer}>
                  <ActivityIndicator size="small" color={Colors.primary} />
                  <Text style={styles.aiLoadingText}> Krishna is contemplating...</Text>
                </View>
              ) : aiResponse ? (
                <ScrollView style={styles.aiResponseScroll} showsVerticalScrollIndicator={false}>
                  <Text style={styles.aiResponseText}>{aiResponse}</Text>
                  <TouchableOpacity 
                    onPress={() => setAiResponse(null)} 
                    style={styles.clearResponseButton}
                  >
                    <Text style={styles.clearResponseText}>Ask another question</Text>
                  </TouchableOpacity>
                </ScrollView>
              ) : (
                <View style={styles.aiInputWrapper}>
                  <View style={styles.aiInputContainer}>
                    <TextInput
                      style={styles.aiTextInput}
                      placeholder="Ask Krishna..."
                      placeholderTextColor={Colors.textMuted}
                      value={inputText}
                      onChangeText={setInputText}
                      multiline={false}
                      onSubmitEditing={() => handleAskQuestion()}
                    />
                    <TouchableOpacity
                      style={styles.aiSendButton}
                      onPress={() => handleAskQuestion()}
                    >
                      <MaterialIcons name="send" size={16} color={Colors.backgroundDark} />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.quickQuestionsContainer}>
                    <TouchableOpacity 
                      style={styles.quickQuestionChip}
                      onPress={() => handleAskQuestion('What is the deeper spiritual meaning of this verse?')}
                    >
                      <Text style={styles.quickQuestionText}>Meaning</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.quickQuestionChip}
                      onPress={() => handleAskQuestion('How can I apply this verse to my modern daily life?')}
                    >
                      <Text style={styles.quickQuestionText}>Practical use</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.quickQuestionChip}
                      onPress={() => handleAskQuestion('Explain the Sanskrit words in this verse.')}
                    >
                      <Text style={styles.quickQuestionText}>Sanskrit</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
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
  bookScroll: {
    flex: 1,
  },
  bookScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  verseNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
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
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textLight,
    lineHeight: 32,
    textAlign: 'center',
    marginBottom: 24,
  },
  translationContainer: {
    backgroundColor: `${Colors.textLight}08`,
    borderRadius: BorderRadius.lg,
    padding: 16,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  translationLabel: {
    fontFamily: Typography.display.join(','),
    fontSize: 9,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  translationText: {
    fontFamily: Typography.display.join(','),
    fontSize: 14,
    color: Colors.textLight,
    lineHeight: 22,
    fontStyle: 'italic',
  },
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
  aiContainer: {
    position: 'absolute',
    zIndex: 100,
  },
  aiOverlay: {
    backgroundColor: Colors.charcoal,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    overflow: 'hidden',
    ...Shadow.lg,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
  },
  aiHeaderCollapsed: {
    justifyContent: 'center',
    paddingHorizontal: 0,
    width: 56,
  },
  aiTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  aiTitle: {
    fontFamily: Typography.serif.join(','),
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textLight,
  },
  aiExpandedContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  aiContextText: {
    fontFamily: Typography.display.join(','),
    fontSize: 12,
    color: Colors.primary,
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  aiInputWrapper: {
    gap: 12,
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
  aiLoadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  aiLoadingText: {
    color: Colors.textMuted,
    fontSize: 14,
    fontStyle: 'italic',
  },
  aiResponseScroll: {
    maxHeight: 180,
  },
  aiResponseText: {
    color: Colors.textLight,
    fontSize: 14,
    lineHeight: 22,
    fontFamily: Typography.display.join(','),
  },
  clearResponseButton: {
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  clearResponseText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  versePage: {
    width: SCREEN_WIDTH - 32,
    flex: 1,
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -22,
    zIndex: 10,
  },
  navButtonLeft: {
    left: 10,
  },
  navButtonRight: {
    right: 10,
  },
});

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, BorderRadius, Shadow } from '@/constants/theme';
import { router } from 'expo-router';

interface ReflectionQuestion {
  id: string;
  question: string;
  placeholder: string;
}

const reflectionQuestions: ReflectionQuestion[] = [
  {
    id: 'gratitude',
    question: 'What are you grateful for today?',
    placeholder: 'Express your gratitude...',
  },
  {
    id: 'learning',
    question: 'What did you learn about yourself?',
    placeholder: 'Share your insights...',
  },
  {
    id: 'challenge',
    question: 'What challenged your practice today?',
    placeholder: 'Describe the obstacles...',
  },
  {
    id: 'intention',
    question: 'What quality will you cultivate tomorrow?',
    placeholder: 'Set your intention...',
  },
];

export default function EveningReflectionScreen() {
  const insets = useSafeAreaInsets();
  const [responses, setResponses] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleResponseChange = (questionId: string, text: string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: text,
    }));
  };

  const handleSubmitReflection = async () => {
    setIsSubmitting(true);
    // TODO: Save reflection to backend
    console.log('Reflection responses:', responses);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    router.back();
  };

  const getProgress = () => {
    const answeredQuestions = Object.keys(responses).length;
    return (answeredQuestions / reflectionQuestions.length) * 100;
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Top Navigation */}
      <View style={styles.topNav}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back-ios" size={24} color={Colors.textMuted} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Evening Reflection</Text>
        <View style={styles.navSpacer} />
      </View>

      {/* Main Content */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Header */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>Contemplative Silence</Text>
          <Text style={styles.subtitle}>Mauna</Text>
          <Text style={styles.description}>
            In the quiet space between {"today's"} activities and {"tomorrow's"} possibilities, 
            find clarity in stillness.
          </Text>
        </View>

        {/* Progress Indicator */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Reflection Progress</Text>
            <Text style={styles.progressPercent}>{Math.round(getProgress())}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${getProgress()}%` }]} />
          </View>
        </View>

        {/* Reflection Questions */}
        <View style={styles.questionsSection}>
          {reflectionQuestions.map((item, index) => (
            <View key={item.id} style={styles.questionCard}>
              <View style={styles.questionHeader}>
                <View style={styles.questionNumber}>
                  <Text style={styles.questionNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.questionText}>{item.question}</Text>
              </View>
              <TextInput
                style={styles.textInput}
                placeholder={item.placeholder}
                placeholderTextColor={Colors.textMuted}
                value={responses[item.id] || ''}
                onChangeText={(text) => handleResponseChange(item.id, text)}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          ))}
        </View>

        {/* Submit Button */}
        <View style={styles.submitSection}>
          <TouchableOpacity 
            style={[
              styles.submitButton,
              isSubmitting && styles.submitButtonDisabled
            ]}
            onPress={handleSubmitReflection}
            disabled={isSubmitting}
            activeOpacity={0.8}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? 'Saving...' : 'Complete Reflection'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

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
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 48,
    paddingHorizontal: 16,
  },
  title: {
    fontFamily: Typography.serif.join(','),
    fontSize: 32,
    fontWeight: '700',
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: Typography.display.join(','),
    fontSize: 16,
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  description: {
    fontFamily: Typography.display.join(','),
    fontSize: 16,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  progressSection: {
    marginBottom: 40,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  progressLabel: {
    fontFamily: Typography.display.join(','),
    fontSize: 10,
    color: `${Colors.textLight}66`, // 40% opacity
    fontWeight: '400',
    letterSpacing: 2.4,
    textTransform: 'uppercase',
  },
  progressPercent: {
    fontFamily: Typography.display.join(','),
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
  progressBar: {
    height: 1,
    backgroundColor: Colors.borderLight,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  questionsSection: {
    gap: 24,
  },
  questionCard: {
    backgroundColor: `${Colors.textLight}0F`, // 6% opacity
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: BorderRadius.xl,
    padding: 24,
    gap: 16,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  questionNumber: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionNumberText: {
    fontFamily: Typography.display.join(','),
    fontSize: 16,
    fontWeight: '700',
    color: Colors.backgroundDark,
  },
  questionText: {
    flex: 1,
    fontFamily: Typography.display.join(','),
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textLight,
    lineHeight: 24,
    marginTop: 4,
  },
  textInput: {
    backgroundColor: `${Colors.textLight}0A`, // 4% opacity
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontFamily: Typography.display.join(','),
    fontSize: 16,
    color: Colors.textLight,
    lineHeight: 24,
    minHeight: 80,
  },
  submitSection: {
    marginTop: 40,
    paddingHorizontal: 24,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.xl,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.primary,
  },
  submitButtonDisabled: {
    backgroundColor: Colors.saffronMuted,
    opacity: 0.6,
  },
  submitButtonText: {
    fontFamily: Typography.display.join(','),
    fontSize: 18,
    fontWeight: '700',
    color: Colors.backgroundDark,
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
    right: '-10%',
    width: 300,
    height: 300,
    backgroundColor: `${Colors.primary}0D`, // 5% opacity
  },
  bottomCircle: {
    bottom: '-10%',
    left: '-10%',
    width: 250,
    height: 250,
    backgroundColor: `${Colors.primary}0D`, // 5% opacity
  },
});

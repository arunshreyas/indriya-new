import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, BorderRadius, Shadow } from '@/constants/theme';

interface GuidanceResponse {
  keyword: string;
  guidance: string;
  quote: string;
}

const guidanceDatabase: Record<string, GuidanceResponse> = {
  anxious: {
    keyword: 'anxious',
    guidance: 'Focus on your action, not the result. The fruit of work is not your concern.',
    quote: 'You have the right to perform your prescribed duty, but you are not entitled to the fruits of action.',
  },
  anxiety: {
    keyword: 'anxiety',
    guidance: 'Focus on your action, not the result. The fruit of work is not your concern.',
    quote: 'You have the right to perform your prescribed duty, but you are not entitled to the fruits of action.',
  },
  worried: {
    keyword: 'worried',
    guidance: 'Focus on your action, not the result. The fruit of work is not your concern.',
    quote: 'You have the right to perform your prescribed duty, but you are not entitled to the fruits of action.',
  },
  lazy: {
    keyword: 'lazy',
    guidance: 'Act without waiting for motivation. Discipline creates its own momentum.',
    quote: 'Perform your duty equipoised, abandoning all attachment to success or failure.',
  },
  unmotivated: {
    keyword: 'unmotivated',
    guidance: 'Act without waiting for motivation. Discipline creates its own momentum.',
    quote: 'Perform your duty equipoised, abandoning all attachment to success or failure.',
  },
  angry: {
    keyword: 'angry',
    guidance: 'Anger comes from unfulfilled desire. Observe it, do not fuel it.',
    quote: 'From anger, complete delusion arises, and from delusion bewilderment of memory.',
  },
  anger: {
    keyword: 'anger',
    guidance: 'Anger comes from unfulfilled desire. Observe it, do not fuel it.',
    quote: 'From anger, complete delusion arises, and from delusion bewilderment of memory.',
  },
  sad: {
    keyword: 'sad',
    guidance: 'This too shall pass. The soul is neither born nor does it die.',
    quote: 'The soul is unborn, eternal, ever-existing, undying, and primeval.',
  },
  depressed: {
    keyword: 'depressed',
    guidance: 'This too shall pass. The soul is neither born nor does it die.',
    quote: 'The soul is unborn, eternal, ever-existing, undying, and primeval.',
  },
  confused: {
    keyword: 'confused',
    guidance: 'In stillness, clarity emerges. Withdraw your senses from their objects.',
    quote: 'When the mind, restrained from material activities, becomes still, then one finds peace.',
  },
  lost: {
    keyword: 'lost',
    guidance: 'In stillness, clarity emerges. Withdraw your senses from their objects.',
    quote: 'When the mind, restrained from material activities, becomes still, then one finds peace.',
  },
  tired: {
    keyword: 'tired',
    guidance: 'Rest is also action. Take refuge in the silence between efforts.',
    quote: 'The yogi who is satisfied with the self, whose mind is fixed in the self, finds peace.',
  },
  exhausted: {
    keyword: 'exhausted',
    guidance: 'Rest is also action. Take refuge in the silence between efforts.',
    quote: 'The yogi who is satisfied with the self, whose mind is fixed in the self, finds peace.',
  },
  stressed: {
    keyword: 'stressed',
    guidance: 'You are not your thoughts. Witness them without becoming them.',
    quote: 'One who is not disturbed by the incessant flow of desires can alone achieve peace.',
  },
  fear: {
    keyword: 'fear',
    guidance: 'Fear is born of separation. Remember: the Self is eternal and unchanging.',
    quote: 'The soul can never be cut to pieces by any weapon, nor burned by fire, nor moistened by water.',
  },
  afraid: {
    keyword: 'afraid',
    guidance: 'Fear is born of separation. Remember: the Self is eternal and unchanging.',
    quote: 'The soul can never be cut to pieces by any weapon, nor burned by fire, nor moistened by water.',
  },
  jealous: {
    keyword: 'jealous',
    guidance: 'Another\'s success takes nothing from you. Focus on your own path.',
    quote: 'A person who is not disturbed by the incessant flow of desires can alone achieve peace.',
  },
  envy: {
    keyword: 'envy',
    guidance: 'Another\'s success takes nothing from you. Focus on your own path.',
    quote: 'A person who is not disturbed by the incessant flow of desires can alone achieve peace.',
  },
  lonely: {
    keyword: 'lonely',
    guidance: 'You are never truly alone. The Self within connects all beings.',
    quote: 'The wise see the same Self in all beings, whether it be a Brahmin, a cow, an elephant, or a dog.',
  },
  distracted: {
    keyword: 'distracted',
    guidance: 'Bring the mind back, again and again. That is the practice.',
    quote: 'From wherever the mind wanders due to its flickering and unsteady nature, one must withdraw it and bring it back under control.',
  },
  bored: {
    keyword: 'bored',
    guidance: 'Boredom is resistance to what is. Find the extraordinary in the ordinary.',
    quote: 'The person whose mind is always free from attachment, who has subdued the mind and senses, attains peace.',
  },
};

const defaultGuidance: GuidanceResponse = {
  keyword: 'general',
  guidance: 'Be present. Act with awareness. That is the path.',
  quote: 'Yoga is the journey of the self, through the self, to the self.',
};

export default function DharmaScreen() {
  const insets = useSafeAreaInsets();
  const [input, setInput] = React.useState('');
  const [response, setResponse] = React.useState<GuidanceResponse | null>(null);
  const [showInput, setShowInput] = React.useState(true);

  const getGuidance = () => {
    const lowerInput = input.toLowerCase().trim();
    
    // Find matching keyword
    let matchedGuidance = defaultGuidance;
    for (const [key, value] of Object.entries(guidanceDatabase)) {
      if (lowerInput.includes(key)) {
        matchedGuidance = value;
        break;
      }
    }
    
    setResponse(matchedGuidance);
    setShowInput(false);
  };

  const reset = () => {
    setInput('');
    setResponse(null);
    setShowInput(true);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <MaterialIcons name="lightbulb" size={32} color={Colors.primary} />
        <Text style={styles.headerTitle}>Dharma</Text>
        <Text style={styles.headerSubtitle}>What guidance do you seek?</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {showInput ? (
          <View style={styles.inputSection}>
            <Text style={styles.prompt}>What are you dealing with?</Text>
            
            <TextInput
              style={styles.input}
              placeholder="I'm feeling anxious about..."
              placeholderTextColor={Colors.textMuted}
              value={input}
              onChangeText={setInput}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <TouchableOpacity
              style={[styles.guidanceButton, !input.trim() && styles.buttonDisabled]}
              onPress={getGuidance}
              disabled={!input.trim()}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Receive Guidance</Text>
              <MaterialIcons name="auto-awesome" size={18} color={Colors.backgroundDark} />
            </TouchableOpacity>

            {/* Quick selectors */}
            <View style={styles.quickTags}>
              <Text style={styles.quickTagsLabel}>Common:</Text>
              <View style={styles.tagsRow}>
                {['anxious', 'lazy', 'angry', 'confused', 'tired'].map((tag) => (
                  <TouchableOpacity
                    key={tag}
                    style={styles.tag}
                    onPress={() => {
                      setInput(`I'm feeling ${tag}`);
                    }}
                  >
                    <Text style={styles.tagText}>{tag}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.responseSection}>
            {response && (
              <>
                <View style={styles.guidanceCard}>
                  <MaterialIcons name="lightbulb" size={24} color={Colors.primary} style={styles.cardIcon} />
                  <Text style={styles.guidanceText}>{response.guidance}</Text>
                </View>

                <View style={styles.quoteCard}>
                  <MaterialIcons name="format-quote" size={20} color={Colors.primary} style={styles.quoteIcon} />
                  <Text style={styles.quoteText}>{response.quote}</Text>
                </View>
              </>
            )}

            <TouchableOpacity style={styles.resetButton} onPress={reset} activeOpacity={0.8}>
              <MaterialIcons name="refresh" size={18} color={Colors.textLight} />
              <Text style={styles.resetButtonText}>Ask Again</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundDark,
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  headerTitle: {
    fontFamily: Typography.serif.join(','),
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textLight,
    marginTop: 12,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontFamily: Typography.display.join(','),
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  inputSection: {
    gap: 20,
  },
  prompt: {
    fontFamily: Typography.display.join(','),
    fontSize: 18,
    fontWeight: '500',
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: 8,
  },
  input: {
    backgroundColor: `${Colors.textLight}0A`,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: BorderRadius.xl,
    padding: 20,
    fontFamily: Typography.display.join(','),
    fontSize: 16,
    color: Colors.textLight,
    lineHeight: 24,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  guidanceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.xl,
    paddingVertical: 16,
    ...Shadow.primary,
  },
  buttonDisabled: {
    backgroundColor: Colors.saffronMuted,
    opacity: 0.5,
  },
  buttonText: {
    fontFamily: Typography.display.join(','),
    fontSize: 16,
    fontWeight: '700',
    color: Colors.backgroundDark,
  },
  quickTags: {
    marginTop: 8,
  },
  quickTagsLabel: {
    fontFamily: Typography.display.join(','),
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 12,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: `${Colors.primary}1A`,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: `${Colors.primary}33`,
  },
  tagText: {
    fontFamily: Typography.display.join(','),
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '500',
  },
  responseSection: {
    gap: 20,
  },
  guidanceCard: {
    backgroundColor: `${Colors.primary}1A`,
    borderWidth: 1,
    borderColor: `${Colors.primary}33`,
    borderRadius: BorderRadius.xl,
    padding: 24,
    gap: 12,
  },
  cardIcon: {
    marginBottom: 4,
  },
  guidanceText: {
    fontFamily: Typography.display.join(','),
    fontSize: 18,
    fontWeight: '500',
    color: Colors.textLight,
    lineHeight: 28,
  },
  quoteCard: {
    backgroundColor: `${Colors.textLight}0A`,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    padding: 20,
    gap: 8,
  },
  quoteIcon: {
    opacity: 0.7,
  },
  quoteText: {
    fontFamily: Typography.display.join(','),
    fontSize: 14,
    color: Colors.textMuted,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: `${Colors.textLight}0A`,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: BorderRadius.xl,
    paddingVertical: 14,
    marginTop: 8,
  },
  resetButtonText: {
    fontFamily: Typography.display.join(','),
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textLight,
  },
});

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
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, BorderRadius, Shadow } from '@/constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@clerk/clerk-expo';
import { indriyaApi } from '@/services/indriyaApi';

interface Reflection {
  id: string;
  text: string;
  date: string;
  timestamp: number;
}

const STORAGE_KEY = '@indriya_reflections';

export default function ReflectionScreen() {
  const insets = useSafeAreaInsets();
  const { getToken, isSignedIn } = useAuth();
  const [reflections, setReflections] = React.useState<Reflection[]>([]);
  const [input, setInput] = React.useState('');
  const [showInput, setShowInput] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);

  // Load reflections on mount
  React.useEffect(() => {
    loadReflections();
  }, []);

  const loadReflections = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Sort by date descending
        parsed.sort((a: Reflection, b: Reflection) => b.timestamp - a.timestamp);
        setReflections(parsed);
      }
    } catch (error) {
      console.error('Failed to load reflections:', error);
    }
  };

  const saveReflections = async (newReflections: Reflection[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newReflections));
    } catch (error) {
      console.error('Failed to save reflections:', error);
    }
  };

  const saveReflection = async () => {
    if (!input.trim()) return;

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    if (editingId) {
      // Update existing
      const updated = reflections.map((r) =>
        r.id === editingId ? { ...r, text: input.trim() } : r
      );
      setReflections(updated);
      saveReflections(updated);
      setEditingId(null);
    } else {
      // Create new
      const newReflection: Reflection = {
        id: Date.now().toString(),
        text: input.trim(),
        date: dateStr,
        timestamp: Date.now(),
      };
      const updated = [newReflection, ...reflections];
      setReflections(updated);
      saveReflections(updated);

      if (isSignedIn) {
        indriyaApi.createReflection(getToken, newReflection.text).catch((error) => {
          console.error('Failed to save reflection to API:', error);
        });
      }
    }

    setInput('');
    setShowInput(false);
  };

  const deleteReflection = (id: string) => {
    Alert.alert('Delete Reflection', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          const updated = reflections.filter((r) => r.id !== id);
          setReflections(updated);
          saveReflections(updated);
        },
      },
    ]);
  };

  const startEdit = (reflection: Reflection) => {
    setInput(reflection.text);
    setEditingId(reflection.id);
    setShowInput(true);
  };

  const cancelEdit = () => {
    setInput('');
    setEditingId(null);
    setShowInput(false);
  };

  const formatDate = (dateStr: string) => {
    return dateStr;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <MaterialIcons name="edit-note" size={32} color={Colors.primary} />
        <Text style={styles.headerTitle}>Reflection</Text>
        <Text style={styles.headerSubtitle}>Capture your thoughts</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Add New Button */}
        {!showInput && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowInput(true)}
            activeOpacity={0.8}
          >
            <MaterialIcons name="add" size={24} color={Colors.backgroundDark} />
            <Text style={styles.addButtonText}>New Reflection</Text>
          </TouchableOpacity>
        )}

        {/* Input Section */}
        {showInput && (
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>
              {editingId ? 'Edit reflection' : 'What is on your mind?'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Write your thoughts here..."
              placeholderTextColor={Colors.textMuted}
              value={input}
              onChangeText={setInput}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              autoFocus
            />
            <View style={styles.inputButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={cancelEdit}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveButton, !input.trim() && styles.buttonDisabled]}
                onPress={saveReflection}
                disabled={!input.trim()}
              >
                <Text style={styles.saveButtonText}>
                  {editingId ? 'Update' : 'Save'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Reflections List */}
        <View style={styles.listSection}>
          <Text style={styles.listTitle}>
            {reflections.length > 0
              ? `Your Reflections (${reflections.length})`
              : 'No reflections yet'}
          </Text>

          {reflections.map((reflection, index) => (
            <View key={reflection.id} style={styles.reflectionCard}>
              <View style={styles.cardHeader}>
                <View style={styles.dateBadge}>
                  <MaterialIcons name="calendar-today" size={12} color={Colors.primary} />
                  <Text style={styles.dateText}>{formatDate(reflection.date)}</Text>
                </View>
                <View style={styles.cardActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => startEdit(reflection)}
                  >
                    <MaterialIcons name="edit" size={18} color={Colors.textMuted} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => deleteReflection(reflection.id)}
                  >
                    <MaterialIcons name="delete-outline" size={18} color={Colors.error} />
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.reflectionText}>{reflection.text}</Text>
            </View>
          ))}
        </View>

        {/* Bottom padding */}
        <View style={styles.bottomPadding} />
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
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.xl,
    paddingVertical: 16,
    marginBottom: 24,
    ...Shadow.primary,
  },
  addButtonText: {
    fontFamily: Typography.display.join(','),
    fontSize: 16,
    fontWeight: '700',
    color: Colors.backgroundDark,
  },
  inputSection: {
    backgroundColor: `${Colors.textLight}0A`,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: BorderRadius.xl,
    padding: 20,
    marginBottom: 24,
  },
  inputLabel: {
    fontFamily: Typography.display.join(','),
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textLight,
    marginBottom: 12,
  },
  input: {
    fontFamily: Typography.display.join(','),
    fontSize: 16,
    color: Colors.textLight,
    lineHeight: 24,
    minHeight: 120,
    textAlignVertical: 'top',
    padding: 0,
  },
  inputButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 16,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  cancelButtonText: {
    fontFamily: Typography.display.join(','),
    fontSize: 14,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: BorderRadius.lg,
  },
  saveButtonText: {
    fontFamily: Typography.display.join(','),
    fontSize: 14,
    fontWeight: '700',
    color: Colors.backgroundDark,
  },
  buttonDisabled: {
    backgroundColor: Colors.saffronMuted,
    opacity: 0.5,
  },
  listSection: {
    gap: 12,
  },
  listTitle: {
    fontFamily: Typography.display.join(','),
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  reflectionCard: {
    backgroundColor: `${Colors.textLight}0A`,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: BorderRadius.xl,
    padding: 16,
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: `${Colors.primary}1A`,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  dateText: {
    fontFamily: Typography.display.join(','),
    fontSize: 11,
    fontWeight: '600',
    color: Colors.primary,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 6,
    borderRadius: BorderRadius.md,
  },
  reflectionText: {
    fontFamily: Typography.display.join(','),
    fontSize: 15,
    color: Colors.textLight,
    lineHeight: 22,
  },
  bottomPadding: {
    height: 32,
  },
});

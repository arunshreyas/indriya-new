import { BorderRadius, Colors, Typography } from '@/constants/theme';
import { Chapter, gitaApi } from '@/services/gitaApi';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function WisdomScreen() {
  const [chapters, setChapters] = React.useState<Chapter[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchChapters = async () => {
    try {
      setError(null);
      const data = await gitaApi.getChapters();
      setChapters(data);
    } catch (err) {
      console.error('Failed to fetch chapters:', err);
      setError('Failed to load chapters. Pull to retry.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  React.useEffect(() => {
    fetchChapters();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchChapters();
  };

  const handleChapterPress = (chapterNumber: number) => {
    router.push({
      pathname: '/gita-reading',
      params: { chapter: chapterNumber.toString() }
    });
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading sacred wisdom...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="menu-book" size={32} color={Colors.primary} />
        <Text style={styles.headerTitle}>Bhagavad Gita</Text>
        <Text style={styles.headerSubtitle}>18 Chapters of Divine Wisdom</Text>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
          />
        }
      >
        {error ? (
          <View style={styles.errorContainer}>
            <MaterialIcons name="error-outline" size={48} color={Colors.error} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <View style={styles.chaptersList}>
            {chapters.map((chapter) => (
              <TouchableOpacity
                key={chapter.id}
                style={styles.chapterCard}
                onPress={() => handleChapterPress(chapter.chapter_number)}
                activeOpacity={0.8}
              >
                <View style={styles.chapterNumber}>
                  <Text style={styles.chapterNumberText}>{chapter.chapter_number}</Text>
                </View>
                <View style={styles.chapterContent}>
                  <Text style={styles.chapterName}>{chapter.name_transliterated}</Text>
                  <Text style={styles.chapterTranslated}>{chapter.name_translated}</Text>
                  <Text style={styles.chapterMeaning} numberOfLines={2}>
                    {chapter.meaning?.en || chapter.summary?.en || 'Sacred wisdom from the Bhagavad Gita'}
                  </Text>
                  <View style={styles.versesBadge}>
                    <MaterialIcons name="format-list-numbered" size={12} color={Colors.primary} />
                    <Text style={styles.versesCount}>{chapter.verses_count} verses</Text>
                  </View>
                </View>
                <MaterialIcons 
                  name="chevron-right" 
                  size={24} 
                  color={Colors.textMuted} 
                  style={styles.chevron}
                />
              </TouchableOpacity>
            ))}
          </View>
        )}
        
        {/* Bottom padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>
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
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  headerTitle: {
    fontFamily: Typography.serif.join(','),
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textLight,
    marginTop: 16,
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
    paddingHorizontal: 16,
  },
  loadingText: {
    fontFamily: Typography.display.join(','),
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 16,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  errorText: {
    fontFamily: Typography.display.join(','),
    fontSize: 14,
    color: Colors.error,
    textAlign: 'center',
    marginTop: 16,
  },
  chaptersList: {
    gap: 12,
  },
  chapterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.textLight}0F`, // 6% opacity
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: BorderRadius.xl,
    padding: 16,
    gap: 16,
  },
  chapterNumber: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chapterNumberText: {
    fontFamily: Typography.display.join(','),
    fontSize: 18,
    fontWeight: '700',
    color: Colors.backgroundDark,
  },
  chapterContent: {
    flex: 1,
  },
  chapterName: {
    fontFamily: Typography.devanagari.join(','),
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 2,
  },
  chapterTranslated: {
    fontFamily: Typography.display.join(','),
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textLight,
    marginBottom: 4,
  },
  chapterMeaning: {
    fontFamily: Typography.display.join(','),
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 8,
    lineHeight: 16,
  },
  versesBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  versesCount: {
    fontFamily: Typography.display.join(','),
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '500',
  },
  chevron: {
    marginLeft: 8,
  },
  bottomPadding: {
    height: 32,
  },
});

import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, BorderRadius } from '@/constants/theme';
import ScreenWrapper from '@/components/ScreenWrapper';
import { gitaApi, Chapter } from '@/services/gitaApi';

export default function WisdomChaptersScreen() {
  const router = useRouter();
  const [chapters, setChapters] = React.useState<Chapter[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchChapters = async () => {
      try {
        const data = await gitaApi.getChapters();
        setChapters(data);
      } catch (err) {
        console.error('Failed to fetch chapters:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchChapters();
  }, []);

  const handleChapterPress = (chapterNumber: number) => {
    router.push({
      pathname: '/gita-reading',
      params: { chapter: chapterNumber.toString() }
    });
  };

  if (loading) {
    return (
      <ScreenWrapper style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.textLight} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Chapters</Text>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
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
                <View style={styles.versesBadge}>
                  <MaterialIcons name="format-list-numbered" size={12} color={Colors.primary} />
                  <Text style={styles.versesCount}>{chapter.verses_count} verses</Text>
                </View>
              </View>
              <MaterialIcons 
                name="chevron-right" 
                size={24} 
                color={Colors.textMuted} 
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textLight,
    fontFamily: Typography.serif.join(','),
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  chaptersList: {
    gap: 12,
  },
  chapterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.textLight}0A`,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: BorderRadius.xl,
    padding: 16,
    gap: 16,
  },
  chapterNumber: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chapterNumberText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.backgroundDark,
  },
  chapterContent: {
    flex: 1,
  },
  chapterName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 2,
    fontFamily: Typography.serif.join(','),
  },
  chapterTranslated: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 4,
  },
  versesBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  versesCount: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '500',
  },
});

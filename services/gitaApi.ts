
const API_BASE_URL = 'https://bhagavad-gita3.p.rapidapi.com/v2';
const API_KEY = 'fcd47f9473mshe02d9d614a5098bp11d9cbjsn47765ad9eeac';
const API_HOST = 'bhagavad-gita3.p.rapidapi.com';

export interface Chapter {
  id: number;
  name: string;
  name_transliterated: string;
  name_translated: string;
  verses_count: number;
  chapter_number: number;
  meaning?: {
    en: string;
    hi: string;
  };
  summary?: {
    en: string;
    hi: string;
  };
}

export interface Verse {
  id: string;
  verse_number: number;
  chapter_number: number;
  text: string;
  translations: Array<{
    id: string;
    description: string;
    author_name: string;
    language: string;
  }>;
  commentaries: Array<{
    id: string;
    description: string;
    author_name: string;
    language: string;
  }>;
}

class GitaApiService {
  private async fetchWithAuth(endpoint: string, params?: Record<string, string>): Promise<any> {
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-rapidapi-host': API_HOST,
          'x-rapidapi-key': API_KEY,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Gita API Error:', error);
      throw error;
    }
  }

  async getChapters(): Promise<Chapter[]> {
    return this.fetchWithAuth('/chapters/', { skip: '0', limit: '18' });
  }

  async getChapter(chapterNumber: number): Promise<Chapter> {
    return this.fetchWithAuth(`/chapters/${chapterNumber}/`);
  }

  async getVerses(chapterNumber: number): Promise<Verse[]> {
    return this.fetchWithAuth(`/chapters/${chapterNumber}/verses/`);
  }

  async getVerse(chapterNumber: number, verseNumber: number): Promise<Verse> {
    return this.fetchWithAuth(`/chapters/${chapterNumber}/verses/${verseNumber}/`);
  }
}

export const gitaApi = new GitaApiService();

export interface Chapter {
  id: number;
  chapter_number: number;
  chapter_summary: string;
  chapter_summary_hindi: string;
  name: string;
  name_meaning: string;
  name_translation: string;
  name_transliterated: string;
  verses_count: number;
}

export const FALLBACK_CHAPTERS: Chapter[] = [
  { id: 1, chapter_number: 1, chapter_summary: '', chapter_summary_hindi: '', name: 'Arjuna Vishada Yoga', name_meaning: 'The Yoga of Arjuna\'s Dejection', name_translation: 'Arjuna\'s Despair', name_transliterated: 'Arjuna Vishada Yoga', verses_count: 47 },
  { id: 2, chapter_number: 2, chapter_summary: '', chapter_summary_hindi: '', name: 'Sankhya Yoga', name_meaning: 'The Yoga of Knowledge', name_translation: 'Transcendental Knowledge', name_transliterated: 'Sankhya Yoga', verses_count: 72 },
  { id: 3, chapter_number: 3, chapter_summary: '', chapter_summary_hindi: '', name: 'Karma Yoga', name_meaning: 'The Yoga of Action', name_translation: 'Path of Action', name_transliterated: 'Karma Yoga', verses_count: 43 },
  { id: 4, chapter_number: 4, chapter_summary: '', chapter_summary_hindi: '', name: 'Jnana Karma Sanyasa Yoga', name_meaning: 'The Yoga of Renunciation Through Knowledge', name_translation: 'Wisdom in Action', name_transliterated: 'Jnana Karma Sanyasa Yoga', verses_count: 42 },
  { id: 5, chapter_number: 5, chapter_summary: '', chapter_summary_hindi: '', name: 'Karma Sanyasa Yoga', name_meaning: 'The Yoga of Renunciation', name_translation: 'Renunciation of Action', name_transliterated: 'Karma Sanyasa Yoga', verses_count: 29 },
  { id: 6, chapter_number: 6, chapter_summary: '', chapter_summary_hindi: '', name: 'Dhyana Yoga', name_meaning: 'The Yoga of Meditation', name_translation: 'Meditation', name_transliterated: 'Dhyana Yoga', verses_count: 47 },
  { id: 7, chapter_number: 7, chapter_summary: '', chapter_summary_hindi: '', name: 'Jnana Vijnana Yoga', name_meaning: 'The Yoga of Knowledge and Realization', name_translation: 'Knowledge of the Absolute', name_transliterated: 'Jnana Vijnana Yoga', verses_count: 30 },
  { id: 8, chapter_number: 8, chapter_summary: '', chapter_summary_hindi: '', name: 'Akshara Brahma Yoga', name_meaning: 'The Yoga of the Imperishable Brahman', name_translation: 'The Imperishable', name_transliterated: 'Akshara Brahma Yoga', verses_count: 28 },
  { id: 9, chapter_number: 9, chapter_summary: '', chapter_summary_hindi: '', name: 'Raja Vidya Raja Guhya Yoga', name_meaning: 'The Yoga of Royal Knowledge and Secret', name_translation: 'Supreme Knowledge', name_transliterated: 'Raja Vidya Raja Guhya Yoga', verses_count: 34 },
  { id: 10, chapter_number: 10, chapter_summary: '', chapter_summary_hindi: '', name: 'Vibhuti Yoga', name_meaning: 'The Yoga of Divine Glories', name_translation: 'Divine Manifestations', name_transliterated: 'Vibhuti Yoga', verses_count: 42 },
  { id: 11, chapter_number: 11, chapter_summary: '', chapter_summary_hindi: '', name: 'Vishvarupa Darshana Yoga', name_meaning: 'The Yoga of the Vision of Universal Form', name_translation: 'Universal Form', name_transliterated: 'Vishvarupa Darshana Yoga', verses_count: 55 },
  { id: 12, chapter_number: 12, chapter_summary: '', chapter_summary_hindi: '', name: 'Bhakti Yoga', name_meaning: 'The Yoga of Devotion', name_translation: 'Devotion', name_transliterated: 'Bhakti Yoga', verses_count: 20 },
  { id: 13, chapter_number: 13, chapter_summary: '', chapter_summary_hindi: '', name: 'Kshetra Kshetrajna Vibhaga Yoga', name_meaning: 'The Yoga of Distinction Between Field and Knower', name_translation: 'Field and Knower', name_transliterated: 'Kshetra Kshetrajna Vibhaga Yoga', verses_count: 35 },
  { id: 14, chapter_number: 14, chapter_summary: '', chapter_summary_hindi: '', name: 'Gunatraya Vibhaga Yoga', name_meaning: 'The Yoga of Division of Three Gunas', name_translation: 'Three Gunas', name_transliterated: 'Gunatraya Vibhaga Yoga', verses_count: 27 },
  { id: 15, chapter_number: 15, chapter_summary: '', chapter_summary_hindi: '', name: 'Purushottama Yoga', name_meaning: 'The Yoga of the Supreme Person', name_translation: 'Supreme Person', name_transliterated: 'Purushottama Yoga', verses_count: 20 },
  { id: 16, chapter_number: 16, chapter_summary: '', chapter_summary_hindi: '', name: 'Daivasura Sampad Vibhaga Yoga', name_meaning: 'The Yoga of Divine and Demonic Qualities', name_translation: 'Divine and Demoniac Qualities', name_transliterated: 'Daivasura Sampad Vibhaga Yoga', verses_count: 24 },
  { id: 17, chapter_number: 17, chapter_summary: '', chapter_summary_hindi: '', name: 'Shraddhatraya Vibhaga Yoga', name_meaning: 'The Yoga of Threefold Faith', name_translation: 'Threefold Faith', name_transliterated: 'Shraddhatraya Vibhaga Yoga', verses_count: 28 },
  { id: 18, chapter_number: 18, chapter_summary: '', chapter_summary_hindi: '', name: 'Moksha Sanyasa Yoga', name_meaning: 'The Yoga of Liberation and Renunciation', name_translation: 'Liberation Through Renunciation', name_transliterated: 'Moksha Sanyasa Yoga', verses_count: 78 },
];

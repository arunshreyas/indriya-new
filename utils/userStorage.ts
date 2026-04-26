import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_STORAGE_KEY = '@indriya_user_data';

export interface UserData {
  intention: string;
  onboarded: boolean;
}

const DEFAULT_USER_DATA: UserData = {
  intention: 'Develop discipline and reduce distractions',
  onboarded: false,
};

export const UserStorage = {
  async getUserData(): Promise<UserData> {
    try {
      const jsonValue = await AsyncStorage.getItem(USER_STORAGE_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : DEFAULT_USER_DATA;
    } catch (e) {
      console.error('Error reading user data:', e);
      return DEFAULT_USER_DATA;
    }
  },

  async saveUserData(data: Partial<UserData>): Promise<void> {
    try {
      const current = await this.getUserData();
      const updated = { ...current, ...data };
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving user data:', e);
    }
  },
};

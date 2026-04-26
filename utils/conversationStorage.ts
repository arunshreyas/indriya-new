import AsyncStorage from '@react-native-async-storage/async-storage';
import { Conversation, Message } from '@/services/openRouter';

const CONVERSATIONS_KEY = '@indriya_conversations';
const ACTIVE_CONVERSATION_KEY = '@indriya_active_conversation';

const getKeys = (userId?: string) => ({
  conversations: userId ? `${CONVERSATIONS_KEY}_${userId}` : CONVERSATIONS_KEY,
  active: userId ? `${ACTIVE_CONVERSATION_KEY}_${userId}` : ACTIVE_CONVERSATION_KEY,
});

export class ConversationStorage {
  // Get all conversations
  static async getAllConversations(userId?: string): Promise<Conversation[]> {
    const keys = getKeys(userId);
    try {
      const stored = await AsyncStorage.getItem(keys.conversations);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading conversations:', error);
      return [];
    }
  }

  // Save all conversations
  static async saveAllConversations(conversations: Conversation[], userId?: string): Promise<void> {
    const keys = getKeys(userId);
    try {
      await AsyncStorage.setItem(keys.conversations, JSON.stringify(conversations));
    } catch (error) {
      console.error('Error saving conversations:', error);
    }
  }

  // Get active conversation
  static async getActiveConversation(userId?: string): Promise<Conversation | null> {
    const keys = getKeys(userId);
    try {
      const activeId = await AsyncStorage.getItem(keys.active);
      if (!activeId) return null;

      const conversations = await this.getAllConversations(userId);
      return conversations.find(c => c.id === activeId) || null;
    } catch (error) {
      console.error('Error loading active conversation:', error);
      return null;
    }
  }

  // Set active conversation
  static async setActiveConversation(conversationId: string, userId?: string): Promise<void> {
    const keys = getKeys(userId);
    try {
      await AsyncStorage.setItem(keys.active, conversationId);
    } catch (error) {
      console.error('Error setting active conversation:', error);
    }
  }

  // Create new conversation
  static async createConversation(title?: string, userId?: string): Promise<Conversation> {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: title || 'New Conversation',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const conversations = await this.getAllConversations(userId);
    conversations.unshift(newConversation); // Add to beginning
    await this.saveAllConversations(conversations, userId);
    await this.setActiveConversation(newConversation.id, userId);

    return newConversation;
  }

  // Add message to conversation
  static async addMessage(conversationId: string, message: Omit<Message, 'timestamp'>, userId?: string): Promise<Conversation | null> {
    try {
      const conversations = await this.getAllConversations(userId);
      const conversationIndex = conversations.findIndex(c => c.id === conversationId);
      
      if (conversationIndex === -1) return null;

      const messageWithTimestamp: Message = {
        ...message,
        timestamp: Date.now(),
      };

      conversations[conversationIndex].messages.push(messageWithTimestamp);
      conversations[conversationIndex].updatedAt = Date.now();

      // Update title if it's the first user message and no custom title
      if (
        conversations[conversationIndex].messages.length === 1 && 
        message.role === 'user' && 
        conversations[conversationIndex].title === 'New Conversation'
      ) {
        const title = message.content.substring(0, 30);
        conversations[conversationIndex].title = title + (message.content.length > 30 ? '...' : '');
      }

      await this.saveAllConversations(conversations, userId);
      return conversations[conversationIndex];
    } catch (error) {
      console.error('Error adding message:', error);
      return null;
    }
  }

  // Delete conversation
  static async deleteConversation(conversationId: string, userId?: string): Promise<void> {
    const keys = getKeys(userId);
    try {
      const conversations = await this.getAllConversations(userId);
      const filtered = conversations.filter(c => c.id !== conversationId);
      await this.saveAllConversations(filtered, userId);

      // Clear active conversation if it was the deleted one
      const activeId = await AsyncStorage.getItem(keys.active);
      if (activeId === conversationId) {
        await AsyncStorage.removeItem(keys.active);
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  }

  // Clear all conversations
  static async clearAllConversations(userId?: string): Promise<void> {
    const keys = getKeys(userId);
    try {
      await AsyncStorage.removeItem(keys.conversations);
      await AsyncStorage.removeItem(keys.active);
    } catch (error) {
      console.error('Error clearing conversations:', error);
    }
  }

  // Get conversation by ID
  static async getConversation(conversationId: string, userId?: string): Promise<Conversation | null> {
    try {
      const conversations = await this.getAllConversations(userId);
      return conversations.find(c => c.id === conversationId) || null;
    } catch (error) {
      console.error('Error getting conversation:', error);
      return null;
    }
  }
}

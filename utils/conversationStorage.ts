import AsyncStorage from '@react-native-async-storage/async-storage';
import { Conversation, Message } from '@/services/openRouter';

const CONVERSATIONS_KEY = '@indriya_conversations';
const ACTIVE_CONVERSATION_KEY = '@indriya_active_conversation';

export class ConversationStorage {
  // Get all conversations
  static async getAllConversations(): Promise<Conversation[]> {
    try {
      const stored = await AsyncStorage.getItem(CONVERSATIONS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading conversations:', error);
      return [];
    }
  }

  // Save all conversations
  static async saveAllConversations(conversations: Conversation[]): Promise<void> {
    try {
      await AsyncStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
    } catch (error) {
      console.error('Error saving conversations:', error);
    }
  }

  // Get active conversation
  static async getActiveConversation(): Promise<Conversation | null> {
    try {
      const activeId = await AsyncStorage.getItem(ACTIVE_CONVERSATION_KEY);
      if (!activeId) return null;

      const conversations = await this.getAllConversations();
      return conversations.find(c => c.id === activeId) || null;
    } catch (error) {
      console.error('Error loading active conversation:', error);
      return null;
    }
  }

  // Set active conversation
  static async setActiveConversation(conversationId: string): Promise<void> {
    try {
      await AsyncStorage.setItem(ACTIVE_CONVERSATION_KEY, conversationId);
    } catch (error) {
      console.error('Error setting active conversation:', error);
    }
  }

  // Create new conversation
  static async createConversation(title?: string): Promise<Conversation> {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: title || 'New Conversation',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const conversations = await this.getAllConversations();
    conversations.unshift(newConversation); // Add to beginning
    await this.saveAllConversations(conversations);
    await this.setActiveConversation(newConversation.id);

    return newConversation;
  }

  // Add message to conversation
  static async addMessage(conversationId: string, message: Omit<Message, 'timestamp'>): Promise<Conversation | null> {
    try {
      const conversations = await this.getAllConversations();
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

      await this.saveAllConversations(conversations);
      return conversations[conversationIndex];
    } catch (error) {
      console.error('Error adding message:', error);
      return null;
    }
  }

  // Delete conversation
  static async deleteConversation(conversationId: string): Promise<void> {
    try {
      const conversations = await this.getAllConversations();
      const filtered = conversations.filter(c => c.id !== conversationId);
      await this.saveAllConversations(filtered);

      // Clear active conversation if it was the deleted one
      const activeId = await AsyncStorage.getItem(ACTIVE_CONVERSATION_KEY);
      if (activeId === conversationId) {
        await AsyncStorage.removeItem(ACTIVE_CONVERSATION_KEY);
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  }

  // Clear all conversations
  static async clearAllConversations(): Promise<void> {
    try {
      await AsyncStorage.removeItem(CONVERSATIONS_KEY);
      await AsyncStorage.removeItem(ACTIVE_CONVERSATION_KEY);
    } catch (error) {
      console.error('Error clearing conversations:', error);
    }
  }

  // Get conversation by ID
  static async getConversation(conversationId: string): Promise<Conversation | null> {
    try {
      const conversations = await this.getAllConversations();
      return conversations.find(c => c.id === conversationId) || null;
    } catch (error) {
      console.error('Error getting conversation:', error);
      return null;
    }
  }
}

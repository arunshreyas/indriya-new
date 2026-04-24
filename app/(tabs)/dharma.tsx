import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, BorderRadius, Shadow } from '@/constants/theme';
import { openRouterService, Message, Conversation } from '@/services/openRouter';
import { ConversationStorage } from '@/utils/conversationStorage';

export default function DharmaScreen() {
  const insets = useSafeAreaInsets();
  const [input, setInput] = React.useState('');
  const [currentConversation, setCurrentConversation] = React.useState<Conversation | null>(null);
  const [conversations, setConversations] = React.useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showConversationList, setShowConversationList] = React.useState(false);
  const scrollViewRef = React.useRef<FlatList>(null);

  React.useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const [activeConv, allConvs] = await Promise.all([
        ConversationStorage.getActiveConversation(),
        ConversationStorage.getAllConversations(),
      ]);
      
      setConversations(allConvs);
      
      if (activeConv) {
        setCurrentConversation(activeConv);
      } else if (allConvs.length > 0) {
        setCurrentConversation(allConvs[0]);
        await ConversationStorage.setActiveConversation(allConvs[0].id);
      } else {
        // Create new conversation if none exist
        const newConv = await ConversationStorage.createConversation('New Conversation');
        setCurrentConversation(newConv);
        setConversations([newConv]);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !currentConversation) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    };

    setIsLoading(true);
    setInput('');

    try {
      // Add user message
      let updatedConv = await ConversationStorage.addMessage(currentConversation.id, userMessage);
      if (updatedConv) {
        setCurrentConversation(updatedConv);
        setConversations(prev => 
          prev.map(c => c.id === updatedConv!.id ? updatedConv! : c)
        );
      }

      // Get AI response
      const messages = updatedConv?.messages || [userMessage];
      const aiResponse = await openRouterService.sendMessage(messages);

      // Add AI message
      const assistantMessage: Message = {
        role: 'assistant',
        content: aiResponse,
        timestamp: Date.now(),
      };

      updatedConv = await ConversationStorage.addMessage(currentConversation.id, assistantMessage);
      if (updatedConv) {
        setCurrentConversation(updatedConv);
        setConversations(prev => 
          prev.map(c => c.id === updatedConv!.id ? updatedConv! : c)
        );
      }

      // Scroll to bottom
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startNewConversation = async () => {
    try {
      const newConv = await ConversationStorage.createConversation();
      setCurrentConversation(newConv);
      setConversations(prev => [newConv, ...prev]);
      setShowConversationList(false);
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const switchConversation = async (conversation: Conversation) => {
    setCurrentConversation(conversation);
    await ConversationStorage.setActiveConversation(conversation.id);
    setShowConversationList(false);
  };

  const deleteConversation = async (conversationId: string) => {
    Alert.alert(
      'Delete Conversation',
      'Are you sure you want to delete this conversation?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await ConversationStorage.deleteConversation(conversationId);
            const updated = conversations.filter(c => c.id !== conversationId);
            setConversations(updated);
            
            if (currentConversation?.id === conversationId && updated.length > 0) {
              setCurrentConversation(updated[0]);
              await ConversationStorage.setActiveConversation(updated[0].id);
            } else if (updated.length === 0) {
              await startNewConversation();
            }
          },
        },
      ]
    );
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer,
      item.role === 'user' ? styles.userMessage : styles.assistantMessage,
    ]}>
      <View style={[
        styles.messageBubble,
        item.role === 'user' ? styles.userBubble : styles.assistantBubble,
      ]}>
        {item.role === 'assistant' && (
          <MaterialIcons name="lightbulb" size={16} color={Colors.primary} style={styles.messageIcon} />
        )}
        <Text style={[
          styles.messageText,
          item.role === 'user' ? styles.userText : styles.assistantText,
        ]}>
          {item.content}
        </Text>
      </View>
      <Text style={styles.messageTime}>{formatTime(item.timestamp)}</Text>
    </View>
  );

  const renderConversationItem = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      style={[
        styles.conversationItem,
        currentConversation?.id === item.id && styles.activeConversation,
      ]}
      onPress={() => switchConversation(item)}
    >
      <View style={styles.conversationContent}>
        <Text style={styles.conversationTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.conversationTime}>
          {new Date(item.updatedAt).toLocaleDateString()}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteConversation(item.id)}
      >
        <MaterialIcons name="delete-outline" size={20} color={Colors.error} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (showConversationList) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setShowConversationList(false)}>
            <MaterialIcons name="chevron-left" size={24} color={Colors.textLight} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Conversations</Text>
          <TouchableOpacity onPress={startNewConversation}>
            <MaterialIcons name="add" size={24} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        <FlatList
          data={conversations}
          renderItem={renderConversationItem}
          keyExtractor={(item) => item.id}
          style={styles.conversationList}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setShowConversationList(true)}>
          <MaterialIcons name="menu" size={24} color={Colors.textLight} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dharma</Text>
        <TouchableOpacity onPress={startNewConversation}>
          <MaterialIcons name="add" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      {currentConversation && (
        <FlatList
          ref={scrollViewRef}
          data={currentConversation.messages}
          renderItem={renderMessage}
          keyExtractor={(item, index) => `${item.timestamp}-${index}`}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="What guidance do you seek?"
          placeholderTextColor={Colors.textMuted}
          value={input}
          onChangeText={setInput}
          multiline
          maxLength={500}
          editable={!isLoading}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            (!input.trim() || isLoading) && styles.sendButtonDisabled,
          ]}
          onPress={sendMessage}
          disabled={!input.trim() || isLoading}
        >
          {isLoading ? (
            <MaterialIcons name="hourglass-empty" size={20} color={Colors.textMuted} />
          ) : (
            <MaterialIcons name="send" size={20} color={Colors.backgroundDark} />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundDark,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  headerTitle: {
    fontFamily: Typography.serif.join(','),
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textLight,
  },
  conversationList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  activeConversation: {
    backgroundColor: `${Colors.primary}1A`,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: 12,
  },
  conversationContent: {
    flex: 1,
  },
  conversationTitle: {
    fontFamily: Typography.display.join(','),
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textLight,
    marginBottom: 4,
  },
  conversationTime: {
    fontFamily: Typography.display.join(','),
    fontSize: 12,
    color: Colors.textMuted,
  },
  deleteButton: {
    padding: 8,
  },
  messagesList: {
    flex: 1,
  },
  messagesContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  messageContainer: {
    marginBottom: 16,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  assistantMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: BorderRadius.xl,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  userBubble: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: `${Colors.textLight}0A`,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderBottomLeftRadius: 4,
  },
  messageIcon: {
    marginTop: 2,
  },
  messageText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  userText: {
    color: Colors.backgroundDark,
    fontFamily: Typography.display.join(','),
    fontWeight: '500',
  },
  assistantText: {
    color: Colors.textLight,
    fontFamily: Typography.display.join(','),
  },
  messageTime: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 4,
    marginHorizontal: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: `${Colors.textLight}0A`,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.textLight,
    maxHeight: 100,
    fontFamily: Typography.display.join(','),
  },
  sendButton: {
    backgroundColor: Colors.primary,
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.primary,
  },
  sendButtonDisabled: {
    backgroundColor: Colors.saffronMuted,
    opacity: 0.5,
  },
});

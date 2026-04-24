interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

const OPENROUTER_API_KEY = 'sk-or-v1-your-api-key-here'; // User will need to set this
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

const DHARMA_SYSTEM_PROMPT = `You are a spiritual guide for the Indriya app, providing wisdom inspired by the Bhagavad Gita and Sanatana Dharma principles. 

Your role:
- Provide calm, practical guidance for life challenges
- Reference relevant teachings from the Bhagavad Gita when appropriate
- Be concise, thoughtful, and non-preachy
- Focus on actionable wisdom rather than motivation
- Maintain a peaceful, supportive tone

Guidelines:
- Responses should be 2-4 sentences maximum
- Include 1 relevant Gita quote when it fits naturally
- Avoid complex jargon - speak simply and clearly
- Focus on the user's immediate concern
- End with a gentle question or reflection point

Example response structure:
1. Acknowledge the situation calmly
2. Provide relevant wisdom/teaching
3. Suggest a practical approach
4. (Optional) Brief Gita reference
5. Gentle closing thought`;

export class OpenRouterService {
  private apiKey: string;

  constructor() {
    this.apiKey = OPENROUTER_API_KEY;
  }

  async sendMessage(messages: Message[]): Promise<string> {
    if (!this.apiKey || this.apiKey === 'sk-or-v1-your-api-key-here') {
      // Fallback to keyword-based responses if no API key
      return this.getFallbackResponse(messages[messages.length - 1]?.content || '');
    }

    try {
      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'HTTP-Referer': 'https://indriya.app',
          'X-Title': 'Indriya - Spiritual Guidance',
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3-haiku',
          messages: [
            { role: 'system', content: DHARMA_SYSTEM_PROMPT },
            ...messages.map(msg => ({
              role: msg.role,
              content: msg.content
            }))
          ],
          temperature: 0.7,
          max_tokens: 150,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || this.getFallbackResponse(messages[messages.length - 1]?.content || '');
    } catch (error) {
      console.error('OpenRouter API error:', error);
      // Fallback to keyword-based responses
      return this.getFallbackResponse(messages[messages.length - 1]?.content || '');
    }
  }

  private getFallbackResponse(userMessage: string): string {
    const message = userMessage.toLowerCase();
    
    if (message.includes('anxious') || message.includes('worry')) {
      return "Anxiety comes from attachment to outcomes. As Krishna says in the Gita, 'You have the right to perform your prescribed duties, but you are not entitled to the fruits of your actions.' Focus on the present moment.";
    }
    
    if (message.includes('lazy') || message.includes('procrastinat')) {
      return "Inertia is a natural force, but consciousness can overcome it. The Gita teaches that action is our dharma - our duty. Take one small step now, no matter how small.";
    }
    
    if (message.includes('angry') || message.includes('anger')) {
      return "Anger clouds wisdom. Krishna advises: 'From anger comes delusion; from delusion, loss of memory; from loss of memory, the destruction of intelligence.' Breathe and observe without reacting.";
    }
    
    if (message.includes('confused') || message.includes('lost')) {
      return "Confusion is the mind seeking clarity. The Gita teaches that wisdom comes from discrimination - seeing what is real and what is not. What feels most true in your heart right now?";
    }
    
    if (message.includes('tired') || message.includes('exhausted')) {
      return "Even the warrior Arjuna needed rest. The body is a temple - honor its needs. True strength includes knowing when to pause and restore.";
    }
    
    return "Every challenge contains an opportunity for growth. What wisdom might this moment be offering you?";
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }
}

export const openRouterService = new OpenRouterService();

export type { Message, Conversation };

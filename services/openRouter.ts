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

const OPENROUTER_API_KEY = process.env.EXPO_PUBLIC_OPENROUTER_API_KEY || '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';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

const DHARMA_SYSTEM_PROMPT = `You are a spiritual guide for the Indriya app, providing concise wisdom based on the Bhagavad Gita's universal teachings.

RESPONSE GUIDELINES:
- Keep responses short, calm, and impactful (mobile-friendly).
- Focus on ONE or TWO key teachings or verses per response.
- Avoid large tables or long lists.
- Provide direct, practical guidance for the user's specific problem.
- Structure: 
  1. A brief, compassionate acknowledgment.
  2. A core Gita teaching/verse reference.
  3. One practical, small step the user can take today.
- Tone: Serene, non-judgmental, and universal.

EXAMPLE: "In Chapter 2, Krishna reminds us that we have control over our actions, but not the results. For your anxiety, try focusing solely on the task at hand for just 5 minutes. Release the worry of what comes next."`;

export class OpenRouterService {
  private apiKey: string;

  constructor() {
    this.apiKey = OPENROUTER_API_KEY;
  }

  async sendMessage(messages: Message[]): Promise<string> {
    console.log('Using OpenRouter API with key:', this.apiKey?.substring(0, 10) + '...');
    
    if (!this.apiKey || this.apiKey === 'sk-or-v1-your-api-key-here') {
      console.log('No valid API key, using fallback');
      return this.getFallbackResponse(messages[messages.length - 1]?.content || '');
    }

    try {
      console.log('Making API call to OpenRouter...');
      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'HTTP-Referer': 'https://indriya.app',
          'X-Title': 'Indriya - Spiritual Guidance',
        },
        body: JSON.stringify({
          model: process.env.EXPO_PUBLIC_OPENROUTER_MODEL || 'google/gemma-2-9b-it:free',
          messages: [
            { role: 'system', content: DHARMA_SYSTEM_PROMPT },
            ...messages.map(msg => ({
              role: msg.role,
              content: msg.content
            }))
          ],
          temperature: 0.7,
          max_tokens: 300,
        }),
      });

      console.log('API response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 401) {
          console.log('OpenRouter API: Invalid or expired key. Using fallback wisdom.');
        } else {
          console.error(`OpenRouter API error: ${response.status} - ${errorText}`);
        }
        return this.getFallbackResponse(messages[messages.length - 1]?.content || '');
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      
      if (content) {
        return content;
      } else {
        return this.getFallbackResponse(messages[messages.length - 1]?.content || '');
      }
    } catch (error) {
      console.log('OpenRouter: Service temporarily unavailable, providing fallback guidance.');
      return this.getFallbackResponse(messages[messages.length - 1]?.content || '');
    }
  }

  private getFallbackResponse(userMessage: string): string {
    const message = userMessage.toLowerCase();
    
    if (message.includes('anxious') || message.includes('worry') || message.includes('stress')) {
      return "Chapter 2 teaches: 'You have the right to perform your prescribed duties, but you are not entitled to the fruits of action.' Focus on your present action, not future outcomes. Take one mindful breath.";
    }
    
    if (message.includes('lazy') || message.includes('procrastinat') || message.includes('unmotivated')) {
      return "In Chapter 3, Krishna says 'Perform your duty equipoised, abandoning all attachment to success or failure.' Action itself purifies. Start with the smallest possible step.";
    }
    
    if (message.includes('angry') || message.includes('anger') || message.includes('mad')) {
      return "Chapter 3 warns: 'From anger, complete delusion arises, and from delusion bewilderment of memory.' Your anger is valid but temporary. Witness it without becoming it.";
    }
    
    if (message.includes('confused') || message.includes('lost') || message.includes('uncertain')) {
      return "Chapter 6 states: 'For one who has conquered the mind, the mind is the best of friends.' Sit in stillness for 3 minutes. Let your inner wisdom guide you.";
    }
    
    if (message.includes('tired') || message.includes('exhausted') || message.includes('burnout')) {
      return "Chapter 18 reminds us: 'The soul is never born, nor does it die at any time.' Your energy is eternal, just temporarily depleted. Rest is sacred action.";
    }
    
    if (message.includes('sad') || message.includes('depressed') || message.includes('grief')) {
      return "Chapter 2 teaches: 'The soul is neither born, nor does it die at any time.' Your sadness passes like clouds over an eternal sky. Be gentle with yourself.";
    }
    
    if (message.includes('fear') || message.includes('afraid') || message.includes('scared')) {
      return "Chapter 2 declares: 'The soul can never be cut to pieces by any weapon, nor burned by fire.' Your true self cannot be harmed. What are you really afraid of?";
    }
    
    if (message.includes('relationship') || message.includes('love') || message.includes('heartbreak')) {
      return "Chapter 12 explains: 'One who is not attached to the fruit of his action, whose mind is satisfied, is dear to Me.' Love without expectation, serve without demand.";
    }
    
    if (message.includes('work') || message.includes('job') || message.includes('career')) {
      return "Chapter 18 advises: 'Perform your prescribed duty, renouncing all attachment to success or failure.' Excellence in your work is its own reward.";
    }
    
    return "Chapter 2 reminds us: 'That which is night for all beings is the time of awakening for the self-controlled.' Your challenge contains hidden wisdom. What might it be teaching you?";
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }
}

export const openRouterService = new OpenRouterService();

export type { Conversation, Message };


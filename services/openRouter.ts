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

const OPENROUTER_API_KEY = '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';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

const DHARMA_SYSTEM_PROMPT = `You are a spiritual guide for the Indriya app, providing wisdom based on the Bhagavad Gita's universal teachings that apply to ALL human experiences.

IMPORTANT PRINCIPLES:
- Answer every question with compassion and wisdom
- The Gita teaches that the soul is eternal and beyond all labels/identities
- All human experiences deserve spiritual guidance
- Provide direct, practical wisdom without judgment

CORE GITA TEACHINGS FOR ALL SITUATIONS:
- Chapter 2: The soul is neither born nor dies, eternal beyond body
- Chapter 6: Mind control, meditation, inner peace
- Chapter 12: Equal vision, compassion for all beings
- Chapter 13: The body as temple, consciousness as eternal
- Chapter 18: True knowledge sees the divine in all

RESPONSE GUIDELINES:
- Always provide specific guidance for ANY situation
- Include relevant Gita chapter/verse references
- Be direct, practical, and compassionate
- Never refuse to answer or say "not enough context"
- Apply Gita wisdom universally to all human experiences

EXAMPLE APPROACHES:
For identity questions: "Chapter 2 teaches that you are the eternal soul, not temporary identities. Krishna says 'The soul is not born, nor does it die.' Your true nature is divine and beyond all labels."

For relationship questions: "Chapter 12 advises seeing the divine in all beings. 'One who is equal to friends and enemies, honor and dishonor, is very dear to Me.' Practice seeing the spark of divinity in everyone."

For any life challenge: "Chapter 18 reminds us that true wisdom sees unity in diversity. All experiences are opportunities for spiritual growth."

ALWAYS ANSWER with specific Gita wisdom for any situation presented.`;

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
          model: 'microsoft/phi-3-mini-128k-instruct:free',
          messages: [
            { role: 'system', content: DHARMA_SYSTEM_PROMPT },
            ...messages.map(msg => ({
              role: msg.role,
              content: msg.content
            }))
          ],
          temperature: 0.8,
          max_tokens: 200,
        }),
      });

      console.log('API response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('API response data:', JSON.stringify(data, null, 2));
      
      const content = data.choices?.[0]?.message?.content;
      console.log('Content extracted:', content);
      
      if (content) {
        console.log('Generated response:', content);
        return content;
      } else {
        console.error('No content in response');
        console.log('Available keys:', Object.keys(data));
        console.log('Choices:', data.choices);
        return this.getFallbackResponse(messages[messages.length - 1]?.content || '');
      }
    } catch (error) {
      console.error('OpenRouter API error:', error);
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


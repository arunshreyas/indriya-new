type GetToken = () => Promise<string | null>;

const DEFAULT_API_BASE_URL = 'https://indriya-api-production.up.railway.app';

const normalizeBaseUrl = (url: string) => {
  const withProtocol = /^https?:\/\//i.test(url) ? url : `https://${url}`;
  return withProtocol.replace(/\/+$/, '');
};

const API_BASE_URL = normalizeBaseUrl(
  process.env.EXPO_PUBLIC_API_BASE_URL || DEFAULT_API_BASE_URL
);

export interface ApiUser {
  id: string;
  createdAt: string;
}

export interface ApiIntention {
  id: string;
  userId: string;
  content: string;
  struggle?: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface ApiReflection {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
}

export interface ApiPractice {
  id: string;
  userId: string;
  date: string;
  completed: boolean;
}

export interface ApiDharmaLog {
  id: string;
  userId: string;
  prompt: string;
  response: string;
  createdAt: string;
}

class ApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

const readErrorMessage = async (response: Response) => {
  const text = await response.text();
  if (!text) {
    return `Request failed with status ${response.status}`;
  }

  try {
    const parsed = JSON.parse(text);
    return parsed.message || parsed.error || text;
  } catch {
    return text;
  }
};

async function authFetch<T>(
  getToken: GetToken,
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getToken();

  if (!token) {
    throw new ApiError('No Clerk session token available', 401);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new ApiError(await readErrorMessage(response), response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export const toApiDate = (date = new Date()) => {
  const normalized = new Date(date);
  normalized.setUTCHours(0, 0, 0, 0);
  return normalized.toISOString();
};

export const indriyaApi = {
  ensureUser(getToken: GetToken) {
    return authFetch<ApiUser>(getToken, '/users/me');
  },

  async createIntention(
    getToken: GetToken,
    input: { content: string; struggle?: string }
  ) {
    return authFetch<ApiIntention>(getToken, '/intention', {
      method: 'POST',
      body: JSON.stringify({
        content: input.content,
        struggle: input.struggle,
      }),
    });
  },

  async createReflection(getToken: GetToken, content: string) {
    return authFetch<ApiReflection>(getToken, '/reflection', {
      method: 'POST',
      body: JSON.stringify({
        content,
      }),
    });
  },

  async getReflections(getToken: GetToken) {
    return authFetch<ApiReflection[]>(getToken, '/reflection');
  },

  async createPractice(
    getToken: GetToken,
    input: { date?: Date; completed?: boolean } = {}
  ) {
    return authFetch<ApiPractice>(getToken, '/practice', {
      method: 'POST',
      body: JSON.stringify({
        date: toApiDate(input.date),
        completed: input.completed ?? true,
      }),
    });
  },

  async createDharmaLog(
    getToken: GetToken,
    input: { prompt: string; response: string }
  ) {
    return authFetch<ApiDharmaLog>(getToken, '/dharma-log', {
      method: 'POST',
      body: JSON.stringify({
        prompt: input.prompt,
        response: input.response,
      }),
    });
  },

  async getDharmaLogs(getToken: GetToken) {
    return authFetch<ApiDharmaLog[]>(getToken, '/dharma-log');
  },
};

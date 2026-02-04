const API_BASE_URL = 'https://clint-crypto-hub-backend-1.onrender.com';

interface AuthResponse {
  token: string;
  user: {
    userId: string;
    email: string;
    fullName: string;
  };
}

interface UserProfile {
  userId: string;
  email: string;
  fullName: string;
}

interface Wallet {
  _id: string;
  user: string;
  currency: string;
  balance: number;
  address: string;
  createdAt: string;
  updatedAt: string;
}

// Token management
const TOKEN_KEY = 'clint_crypto_token';

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

// API helper
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
};

// Auth API
export const authApi = {
  signup: async (email: string, password: string, fullName: string): Promise<AuthResponse> => {
    const data = await apiRequest<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, fullName }),
    });
    setToken(data.token);
    return data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const data = await apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setToken(data.token);
    return data;
  },

  logout: (): void => {
    removeToken();
  },
};

// User API
export const userApi = {
  getProfile: async (): Promise<UserProfile> => {
    return apiRequest<UserProfile>('/users/me');
  },

  updateProfile: async (fullName: string): Promise<UserProfile> => {
    return apiRequest<UserProfile>('/users/me', {
      method: 'PUT',
      body: JSON.stringify({ fullName }),
    });
  },
};

// Wallet API
export const walletApi = {
  getWallets: async (): Promise<Wallet[]> => {
    return apiRequest<Wallet[]>('/api/wallets');
  },

  createWallet: async (currency: string, address: string): Promise<Wallet> => {
    return apiRequest<Wallet>('/api/wallets', {
      method: 'POST',
      body: JSON.stringify({ currency, address }),
    });
  },
};

export type { AuthResponse, UserProfile, Wallet };

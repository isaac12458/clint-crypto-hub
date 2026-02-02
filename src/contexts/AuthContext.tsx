import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, userApi, getToken, removeToken, UserProfile } from '@/lib/api';

interface User {
  email: string;
  fullName?: string;
  userId?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, fullName: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (fullName: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  showWelcome: boolean;
  setShowWelcome: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);

  // Check for existing token on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();
      if (token) {
        try {
          const profile = await userApi.getProfile();
          setUser({
            email: profile.email,
            fullName: profile.fullName,
            userId: profile.userId,
          });
        } catch (error) {
          console.error('Failed to fetch profile:', error);
          removeToken();
        }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await authApi.login(email, password);
      setUser({
        email: response.user.email,
        fullName: response.user.fullName,
        userId: response.user.userId,
      });
      setShowWelcome(true);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      const message = error instanceof Error ? error.message : 'Login failed';
      return { success: false, error: message };
    }
  };

  const signup = async (email: string, password: string, fullName: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await authApi.signup(email, password, fullName);
      setUser({
        email: response.user.email,
        fullName: response.user.fullName,
        userId: response.user.userId,
      });
      setShowWelcome(true);
      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      const message = error instanceof Error ? error.message : 'Signup failed';
      return { success: false, error: message };
    }
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
    setShowWelcome(false);
  };

  const updateProfile = async (fullName: string) => {
    try {
      const updatedProfile = await userApi.updateProfile(fullName);
      setUser(prev => prev ? {
        ...prev,
        fullName: updatedProfile.fullName,
        userId: updatedProfile.userId,
      } : null);
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    // Note: Your backend doesn't have a change password endpoint yet
    // This is a placeholder - you'll need to add this endpoint to your backend
    console.warn('Change password not implemented in backend');
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        updateProfile,
        changePassword,
        showWelcome,
        setShowWelcome,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

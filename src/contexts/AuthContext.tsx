import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  email: string;
  fullName?: string;
  userId?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (fullName: string) => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  showWelcome: boolean;
  setShowWelcome: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock login - accept any email with 8+ char password
    if (password.length >= 8) {
      setUser({ email });
      setShowWelcome(true);
      return true;
    }
    return false;
  };

  const signup = async (email: string, password: string): Promise<boolean> => {
    // Mock signup - accept any email with 8+ char password
    if (password.length >= 8) {
      setUser({ email });
      setShowWelcome(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setShowWelcome(false);
  };

  const updateProfile = (fullName: string) => {
    if (user) {
      const userId = `CC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      setUser({ ...user, fullName, userId });
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    // Mock password change
    if (currentPassword.length >= 8 && newPassword.length >= 8) {
      return true;
    }
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
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

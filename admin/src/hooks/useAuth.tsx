import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../types';
import { TOKEN_KEY, USER_KEY } from '../utils/constants';

interface AuthContextType extends AuthState {
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
  });

  // Initialize auth state from localStorage
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    const userStr = localStorage.getItem(USER_KEY);

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        
        // Validate user object has required fields
        if (!user.id || !user.email) {
          throw new Error('Invalid user data');
        }
        
        // Ensure role is a string
        if (user.role && typeof user.role === 'object') {
          user.role = user.role.name || 'admin';
        }

        // If no role, default to admin for development
        if (!user.role) {
          console.warn('User has no role, defaulting to admin');
          user.role = 'admin';
        }

        console.log('Auth loaded user:', user);
        
        setAuthState({
          user,
          token,
          isAuthenticated: true,
        });
      } catch (error) {
        console.error('Failed to parse user data:', error);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
    }
  }, []);

  const login = (token: string, user: User) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    setAuthState({
      user,
      token,
      isAuthenticated: true,
    });
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  };

  const updateUser = (user: User) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    setAuthState(prev => ({
      ...prev,
      user,
    }));
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};


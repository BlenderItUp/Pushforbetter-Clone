// src/hooks/useAuth.tsx
import React, { createContext, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { loginUser, createUser, clearUser } from '../slices/userSlice';

interface AuthContextType {
  user: any;
  error: string | null;
  login: (name: string) => Promise<void>;
  logout: () => void;
  createUser: (name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC = ({ children }) => {
  const user = useSelector((state: RootState) => state.user.user);
  const error = useSelector((state: RootState) => state.user.error);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !error) {
      navigate('/', { replace: true });
    }
  }, [user, error, navigate]);

  const login = async (name: string) => {
    await dispatch(loginUser(name));
  };

  const logout = () => {
    dispatch(clearUser());
    navigate('/login', { replace: true });
  };

  const createAccount = async (name: string) => {
    await dispatch(createUser(name));
  };

  return (
    <AuthContext.Provider value={{ user, error, login, logout, createUser: createAccount }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

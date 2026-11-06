import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const setAuthHeader = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('phishguard_token');
    if (!token) {
      setLoading(false);
      return;
    }
    setAuthHeader(token);
    try {
      const res = await axios.get('/api/auth/profile');
      setUser(res.data.user);
    } catch {
      localStorage.removeItem('phishguard_token');
      setAuthHeader(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email, password) => {
    const res = await axios.post('/api/auth/login', { email, password });
    const { token, user } = res.data;
    localStorage.setItem('phishguard_token', token);
    setAuthHeader(token);
    setUser(user);
    return user;
  };

  const signup = async (name, email, password) => {
    const res = await axios.post('/api/auth/signup', { name, email, password });
    const { token, user } = res.data;
    localStorage.setItem('phishguard_token', token);
    setAuthHeader(token);
    setUser(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem('phishguard_token');
    setAuthHeader(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

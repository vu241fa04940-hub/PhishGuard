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
      const res = await axios.get('/api/auth/profile', { timeout: 3000 });
      setUser(res.data.user);
    } catch {
      const savedDemo = localStorage.getItem('phishguard_demo_user');
      if (savedDemo) {
        setUser(JSON.parse(savedDemo));
      } else {
        localStorage.removeItem('phishguard_token');
        setAuthHeader(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email, password) => {
    try {
      const res = await axios.post('/api/auth/login', { email, password }, { timeout: 4000 });
      const { token, user } = res.data;
      localStorage.setItem('phishguard_token', token);
      setAuthHeader(token);
      setUser(user);
      return user;
    } catch (err) {
      if (!err.response || err.response.status === 404 || err.code === 'ERR_NETWORK') {
        const demoUser = { id: 'demo-user', name: email.split('@')[0] || 'Security Analyst', email };
        const demoToken = 'demo-session-token';
        localStorage.setItem('phishguard_token', demoToken);
        localStorage.setItem('phishguard_demo_user', JSON.stringify(demoUser));
        setAuthHeader(demoToken);
        setUser(demoUser);
        return demoUser;
      }
      throw err;
    }
  };

  const signup = async (name, email, password) => {
    try {
      const res = await axios.post('/api/auth/signup', { name, email, password }, { timeout: 4000 });
      const { token, user } = res.data;
      localStorage.setItem('phishguard_token', token);
      setAuthHeader(token);
      setUser(user);
      return user;
    } catch (err) {
      if (!err.response || err.response.status === 404 || err.code === 'ERR_NETWORK') {
        const demoUser = { id: 'demo-user', name: name || 'Security Analyst', email };
        const demoToken = 'demo-session-token';
        localStorage.setItem('phishguard_token', demoToken);
        localStorage.setItem('phishguard_demo_user', JSON.stringify(demoUser));
        setAuthHeader(demoToken);
        setUser(demoUser);
        return demoUser;
      }
      throw err;
    }
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

import { createContext, useContext, useState, useEffect } from 'react';
import { getMe, login as loginApi, logout as logoutApi } from '../services/api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      getMe()
        .then((res) => setUser(res.data.data))
        .catch(() => localStorage.removeItem('accessToken'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    const res = await loginApi(credentials);
    const { accessToken, user: userData } = res.data.data;
    localStorage.setItem('accessToken', accessToken);
    setUser(userData);
    return userData;
  };

  const logout = async () => {
    try { await logoutApi(); } catch (e) {}
    localStorage.removeItem('accessToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { ref, get } from 'firebase/database';
import { auth, database, isFirebaseConfigured, seedData } from '../services/firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [adminRole, setAdminRole] = useState(null); // 'superadmin' | 'editor'
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    // Check local storage for persistent demo login session
    const storedDemo = localStorage.getItem('sastabazar_demo_admin');
    if (storedDemo) {
      try {
        const parsed = JSON.parse(storedDemo);
        setCurrentUser({ uid: parsed.uid, email: parsed.email });
        setAdminRole(parsed.role || 'superadmin');
        setLoading(false);
        return;
      } catch (e) {
        localStorage.removeItem('sastabazar_demo_admin');
      }
    }

    if (!isFirebaseConfigured || !auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setAuthError(null);
      if (user) {
        try {
          // Strict security boundary check: user MUST exist in /admins/{uid}
          if (database) {
            const adminSnap = await get(ref(database, `admins/${user.uid}`));
            if (!adminSnap.exists()) {
              // Authenticated with Firebase Auth, but NOT an authorized admin in database
              console.warn(`Unauthorized access attempt by UID: ${user.uid}`);
              await signOut(auth);
              setCurrentUser(null);
              setAdminRole(null);
              setAuthError('Unauthorized: Your account is not listed in the administrative directory.');
              setLoading(false);
              return;
            }

            const adminData = adminSnap.val();
            setCurrentUser(user);
            setAdminRole(adminData.role || 'editor');
          } else {
            setCurrentUser(user);
            setAdminRole('editor');
          }
        } catch (err) {
          console.error('Error verifying admin authorization:', err);
          setAuthError('Failed to verify admin credentials.');
          setCurrentUser(null);
          setAdminRole(null);
        }
      } else {
        setCurrentUser(null);
        setAdminRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Standard Firebase email/pass login
  const login = async (email, password) => {
    setAuthError(null);
    if (!isFirebaseConfigured || !auth) {
      throw new Error('Firebase credentials not configured in .env. Use Quick Demo Login.');
    }
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Demo Login for rapid development / testing without Firebase setup
  const demoLogin = (role = 'superadmin') => {
    const demoUser = {
      uid: 'admin_demo_seed',
      email: 'admin@sastabazar.com',
      role,
    };
    localStorage.setItem('sastabazar_demo_admin', JSON.stringify(demoUser));
    setCurrentUser({ uid: demoUser.uid, email: demoUser.email });
    setAdminRole(role);
    setAuthError(null);
  };

  const logout = async () => {
    localStorage.removeItem('sastabazar_demo_admin');
    if (auth) {
      await signOut(auth);
    }
    setCurrentUser(null);
    setAdminRole(null);
    setAuthError(null);
  };

  const isSuperAdmin = adminRole === 'superadmin';
  const isEditor = adminRole === 'editor' || isSuperAdmin;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        adminRole,
        isSuperAdmin,
        isEditor,
        loading,
        authError,
        login,
        demoLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

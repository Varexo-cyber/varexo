// Auth service - uses Netlify Functions API with localStorage fallback
import { authAPI } from './api';

const STORAGE_KEY = 'varexo_user';
const USERS_KEY = 'varexo_users'; // Fallback for local dev

export interface MockUser {
  email: string;
  displayName: string;
  photoURL?: string;
  provider?: 'email' | 'google';
  isAdmin?: boolean;
  emailNotifications?: boolean;
  emailLanguage?: 'nl' | 'en';
}

interface StoredUser {
  email: string;
  password: string;
  displayName: string;
  emailNotifications?: boolean;
}

// Fallback: Get all registered users from localStorage
const getUsers = (): StoredUser[] => {
  return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
};

// Fallback: Save users list to localStorage
const saveUsers = (users: StoredUser[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const mockAuth = {
  // Demo credentials (always works)
  DEMO_EMAIL: 'demo@varexo.nl',
  DEMO_PASSWORD: 'demo123',

  // Register new user with email/password
  signUp: async (email: string, password: string, displayName: string): Promise<MockUser> => {
    try {
      const user = await authAPI.signup(email, password, displayName);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      return user;
    } catch (apiError: any) {
      // Fallback to localStorage
      console.warn('API unavailable, using localStorage fallback');
      await new Promise(resolve => setTimeout(resolve, 800));

      const users = getUsers();
      if (users.some(u => u.email === email)) {
        throw new Error('Email is al geregistreerd.');
      }

      const newUser: StoredUser = { email, password, displayName };
      users.push(newUser);
      saveUsers(users);

      const user: MockUser = { email, displayName, provider: 'email' };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      return user;
    }
  },

  // Sign in with email/password
  signIn: async (email: string, password: string): Promise<MockUser> => {
    try {
      const user = await authAPI.login(email, password);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      return user;
    } catch (apiError: any) {
      // Fallback to localStorage
      console.warn('API unavailable, using localStorage fallback');
      await new Promise(resolve => setTimeout(resolve, 800));

      // Demo account always works
      if (email === mockAuth.DEMO_EMAIL && password === mockAuth.DEMO_PASSWORD) {
        const user: MockUser = { email, displayName: 'Demo Klant', provider: 'email' };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        return user;
      }

      const users = getUsers();
      const found = users.find(u => u.email === email && u.password === password);

      if (found) {
        const user: MockUser = { email: found.email, displayName: found.displayName, provider: 'email' };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        return user;
      }

      throw new Error('Onjuist e-mailadres of wachtwoord.');
    }
  },

  // Save Google user to database and localStorage
  saveGoogleUser: async (email: string, displayName: string, photoURL?: string): Promise<MockUser> => {
    const user: MockUser = { email, displayName, photoURL, provider: 'google' };

    // Try saving to database via API
    try {
      const dbUser = await authAPI.googleLogin(email, displayName, photoURL);
      const savedUser: MockUser = {
        email: dbUser.email || email,
        displayName: dbUser.displayName || displayName,
        photoURL: dbUser.photoURL || photoURL,
        provider: 'google',
        isAdmin: dbUser.isAdmin
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedUser));
      return savedUser;
    } catch (apiErr) {
      console.error('Google API save failed:', apiErr);
      // If account is deleted, don't allow fallback and clean up localStorage
      if ((apiErr as Error).message.includes('verwijderd')) {
        localStorage.removeItem(STORAGE_KEY); // Clean up!
        throw new Error((apiErr as Error).message);
      }
      // Fallback: save to localStorage only for other errors
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      return user;
    }
  },

  // Sign out
  signOut: async (): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    localStorage.removeItem(STORAGE_KEY);
  },

  // Get current user
  getCurrentUser: (): MockUser | null => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  // Check if user is logged in
  isLoggedIn: (): boolean => {
    return !!localStorage.getItem(STORAGE_KEY);
  },

  // Subscribe to auth changes
  onAuthChanged: (callback: (user: MockUser | null) => void): (() => void) => {
    callback(mockAuth.getCurrentUser());

    let lastUser = mockAuth.getCurrentUser();
    const interval = setInterval(() => {
      const current = mockAuth.getCurrentUser();
      if (JSON.stringify(current) !== JSON.stringify(lastUser)) {
        lastUser = current;
        callback(current);
      }
    }, 500);

    return () => clearInterval(interval);
  },

  // Update user profile
  updateProfile: async (updates: Partial<MockUser>): Promise<MockUser> => {
    const currentUser = mockAuth.getCurrentUser();
    if (!currentUser) {
      throw new Error('Geen gebruiker ingelogd');
    }

    try {
      await authAPI.updateProfile(currentUser.email, updates as any);
    } catch {
      console.warn('API unavailable for profile update');
    }

    const updatedUser: MockUser = { ...currentUser, ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));

    // Also update in users list if email/password user
    const users = getUsers();
    const userIndex = users.findIndex(u => u.email === currentUser.email);
    if (userIndex >= 0) {
      users[userIndex] = {
        ...users[userIndex],
        displayName: updates.displayName || users[userIndex].displayName,
        emailNotifications: updates.emailNotifications !== undefined ? updates.emailNotifications : users[userIndex].emailNotifications
      };
      saveUsers(users);
    }

    return updatedUser;
  },

  // Change password
  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    const currentUser = mockAuth.getCurrentUser();
    if (!currentUser) {
      throw new Error('Geen gebruiker ingelogd');
    }

    try {
      await authAPI.changePassword(currentUser.email, currentPassword, newPassword);
      return;
    } catch (apiError: any) {
      // Fallback to localStorage
      console.warn('API unavailable for password change');
    }

    const users = getUsers();
    const userIndex = users.findIndex(u => u.email === currentUser.email);

    if (userIndex === -1) {
      throw new Error('Gebruiker niet gevonden');
    }

    if (users[userIndex].password !== currentPassword) {
      throw new Error('Huidig wachtwoord is onjuist');
    }

    users[userIndex].password = newPassword;
    saveUsers(users);
  },

  // Forgot password - request reset link
  forgotPassword: async (email: string): Promise<void> => {
    try {
      await authAPI.forgotPassword(email);
      return;
    } catch (apiError: any) {
      // Always show success to prevent email enumeration
      console.warn('API unavailable for forgot password');
    }
  },

  // Reset password with token
  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    try {
      await authAPI.resetPassword(token, newPassword);
      return;
    } catch (apiError: any) {
      throw new Error(apiError.message || 'Wachtwoord resetten mislukt. Probeer het opnieuw.');
    }
  }
};

export default mockAuth;

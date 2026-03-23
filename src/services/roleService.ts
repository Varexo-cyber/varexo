// Admin and role management system
export interface UserRole {
  isAdmin: boolean;
  email: string;
}

export const ADMIN_EMAIL = 'info@varexo.nl';

export const roleService = {
  // Check if user is admin
  isAdmin: (email: string): boolean => {
    return email === ADMIN_EMAIL;
  },

  // Get user role
  getUserRole: (email: string): UserRole => {
    return {
      isAdmin: email === ADMIN_EMAIL,
      email
    };
  },

  // Admin-only access check
  requireAdmin: (email: string): boolean => {
    return email === ADMIN_EMAIL;
  }
};

export default roleService;

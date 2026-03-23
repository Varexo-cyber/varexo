// Google OAuth 2.0 service with real Google Sign-In
declare global {
  interface Window {
    google: any;
  }
}

const GOOGLE_CLIENT_ID = '944648879731-5ghdr7fhmqgikg1bjd22q20k011flujl.apps.googleusercontent.com';

export interface GoogleUser {
  email: string;
  displayName: string;
  photoURL?: string;
  provider: 'google';
  id: string;
}

export const googleAuthService = {
  // Initialize Google Sign-In
  initialize: (): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Load Google Identity Services script
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.onload = () => {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response: any) => {
            // This callback will be handled by the signIn function
            console.log('Google auth initialized');
          },
          auto_select: false,
          cancel_on_tap_outside: true,
        });
        resolve();
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  },

  // Sign in with Google
  signIn: (): Promise<GoogleUser> => {
    return new Promise((resolve, reject) => {
      if (!window.google) {
        reject(new Error('Google auth not initialized'));
        return;
      }

      // Use Google's popup-based sign-in
      window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: 'openid email profile',
        callback: (response: any) => {
          if (response.access_token) {
            // Get user info with the access token
            googleAuthService.getUserInfo(response.access_token)
              .then((user: GoogleUser) => resolve(user))
              .catch(reject);
          } else {
            reject(new Error('Google sign-in failed'));
          }
        },
      }).requestAccessToken();
    });
  },

  // Get user info from Google
  getUserInfo: async (accessToken: string): Promise<GoogleUser> => {
    try {
      const response = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`);
      const data = await response.json();

      return {
        email: data.email,
        displayName: data.name,
        photoURL: data.picture,
        provider: 'google',
        id: data.id,
      };
    } catch (error) {
      throw new Error('Failed to get user info from Google');
    }
  },

  // Render Google Sign-In button
  renderButton: (elementId: string, onClick: () => void) => {
    if (!window.google) {
      console.error('Google auth not initialized');
      return;
    }

    window.google.accounts.id.renderButton(
      document.getElementById(elementId),
      {
        theme: 'filled_blue',
        size: 'large',
        text: 'signin_with',
        shape: 'rectangular',
        logo_alignment: 'left',
        width: 300,
      }
    );

    // Override the click handler
    const button = document.querySelector(`#${elementId} div[role="button"]`);
    if (button) {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        onClick();
      });
    }
  },

  // Sign out
  signOut: async (): Promise<void> => {
    if (window.google && window.google.accounts.id) {
      window.google.accounts.id.disableAutoSelect();
    }
  },
};

export default googleAuthService;

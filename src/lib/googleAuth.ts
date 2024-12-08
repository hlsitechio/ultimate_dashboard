import { OAuth2Client } from 'google-auth-library';

const CLIENT_ID = '558707488708-v76vgf0dlsqbhj3egm73h9vj99kgvet3.apps.googleusercontent.com';
const REDIRECT_URI = 'https://hlsdashboard.netlify.app';

export async function initGoogleAuth(scopes: string[]) {
  try {
    // Create URL for Google OAuth consent screen
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
      `&response_type=token` +
      `&scope=${encodeURIComponent(scopes.join(' '))}`;

    // Open popup for authentication
    const popup = window.open(
      authUrl,
      'Google Auth',
      'width=600,height=600,menubar=no,toolbar=no,location=no,status=no'
    );

    if (!popup) {
      throw new Error('Popup blocked. Please allow popups for this site.');
    }

    // Handle the OAuth response
    return new Promise<string>((resolve, reject) => {
      let timeout: NodeJS.Timeout;

      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data?.type === 'GOOGLE_AUTH_SUCCESS') {
          cleanup();
          resolve(event.data.accessToken);
        } else if (event.data?.type === 'GOOGLE_AUTH_ERROR') {
          cleanup();
          reject(new Error(event.data.error));
        }
      };

      const handlePopupClose = () => {
        if (!popup.closed) return;
        cleanup();
        reject(new Error('Authentication cancelled'));
      };

      const cleanup = () => {
        window.removeEventListener('message', handleMessage);
        clearInterval(checkPopupInterval);
        clearTimeout(timeout);
        popup.close();
      };

      // Set up message listener
      window.addEventListener('message', handleMessage);

      // Check if popup is closed
      const checkPopupInterval = setInterval(handlePopupClose, 1000);

      // Set timeout
      timeout = setTimeout(() => {
        cleanup();
        reject(new Error('Authentication timed out'));
      }, 120000); // 2 minutes timeout
    });
  } catch (error) {
    console.error('Google authentication error:', error);
    throw error;
  }
}
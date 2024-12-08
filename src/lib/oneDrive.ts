import { PublicClientApplication, InteractionRequiredAuthError } from '@azure/msal-browser';
import { Client } from '@microsoft/microsoft-graph-client';
import { AuthCodeMSALBrowserAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser';

const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_MICROSOFT_CLIENT_ID || '',
    authority: 'https://login.microsoftonline.com/common',
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false,
  },
};

const scopes = [
  'Files.ReadWrite',
  'Files.ReadWrite.All',
  'Sites.ReadWrite.All',
  'User.Read',
];

export const msalInstance = new PublicClientApplication(msalConfig);

let authProvider: AuthCodeMSALBrowserAuthenticationProvider;
let graphClient: Client;

export async function initOneDrive() {
  try {
    await msalInstance.initialize();
    const accounts = msalInstance.getAllAccounts();
    
    if (accounts.length === 0) {
      const response = await msalInstance.loginPopup({ scopes });
      if (response.account) {
        msalInstance.setActiveAccount(response.account);
      }
    }

    authProvider = new AuthCodeMSALBrowserAuthenticationProvider(msalInstance, {
      account: msalInstance.getAllAccounts()[0],
      scopes,
      interactionType: 'popup',
    });

    graphClient = Client.initWithMiddleware({ authProvider });
    
    // Test the connection by listing files
    await listFiles();
    return true;
  } catch (error) {
    console.error('OneDrive initialization error:', error);
    throw error;
  }
}

export async function uploadFile(file: File, path: string = '/') {
  try {
    if (!graphClient) throw new Error('OneDrive not initialized');
    
    // For large files, use upload session
    if (file.size > 4 * 1024 * 1024) {
      const uploadSession = await graphClient
        .api(`/me/drive/root:${path}${file.name}:/createUploadSession`)
        .post({});
      
      const uploadUrl = uploadSession.uploadUrl;
      const chunkSize = 320 * 1024; // 320KB chunks
      
      for (let i = 0; i < file.size; i += chunkSize) {
        const chunk = file.slice(i, Math.min(i + chunkSize, file.size));
        await fetch(uploadUrl, {
          method: 'PUT',
          headers: {
            'Content-Length': `${chunk.size}`,
            'Content-Range': `bytes ${i}-${Math.min(i + chunkSize, file.size) - 1}/${file.size}`
          },
          body: chunk
        });
      }
    } else {
      // For small files, use simple upload
      const arrayBuffer = await file.arrayBuffer();
      await graphClient
        .api(`/me/drive/root:${path}${file.name}:/content`)
        .put(arrayBuffer);
    }
    
    // Refresh the file list
    return await listFiles(path);
  } catch (error) {
    if (error instanceof InteractionRequiredAuthError) {
      await msalInstance.loginPopup({ scopes });
      return uploadFile(file, path);
    }
    throw error;
  }
}

export async function listFiles(path: string = '/') {
  try {
    if (!graphClient) throw new Error('OneDrive not initialized');

    const response = await graphClient
      .api(`/me/drive/root:${path}:/children`)
      .select('id,name,size,webUrl,lastModifiedDateTime,folder')
      .orderby('lastModifiedDateTime desc')
      .get();
      
    return response.value;
  } catch (error) {
    if (error instanceof InteractionRequiredAuthError) {
      await msalInstance.loginPopup({ scopes });
      return listFiles(path);
    }
    throw error;
  }
}

export async function deleteFile(fileId: string) {
  try {
    if (!graphClient) throw new Error('OneDrive not initialized');

    await graphClient
      .api(`/me/drive/items/${fileId}`)
      .delete();
  } catch (error) {
    if (error instanceof InteractionRequiredAuthError) {
      await msalInstance.loginPopup({ scopes });
      return deleteFile(fileId);
    }
    throw error;
  }
}

export async function downloadFile(fileId: string) {
  try {
    if (!graphClient) throw new Error('OneDrive not initialized');

    const response = await graphClient
      .api(`/me/drive/items/${fileId}/content`)
      .get();
    return response;
  } catch (error) {
    if (error instanceof InteractionRequiredAuthError) {
      await msalInstance.loginPopup({ scopes });
      return downloadFile(fileId);
    }
    throw error;
  }
}

export async function createFolder(name: string, path: string = '/') {
  try {
    if (!graphClient) throw new Error('OneDrive not initialized');

    const driveItem = {
      name,
      folder: {},
      '@microsoft.graph.conflictBehavior': 'rename'
    };

    const response = await graphClient
      .api(`/me/drive/root:${path}:/children`)
      .post(driveItem);
      
    return response;
  } catch (error) {
    if (error instanceof InteractionRequiredAuthError) {
      await msalInstance.loginPopup({ scopes });
      return createFolder(name, path);
    }
    throw error;
  }
}
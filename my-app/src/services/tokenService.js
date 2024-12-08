import { PublicClientApplication } from "@azure/msal-browser";
import { loginRequest, msalConfig } from "../authConfig";

const msalInstance = new PublicClientApplication(msalConfig);

/**
 * Acquires a token silently or falls back to interactive login.
 * @returns {Promise<string>} - The access token
 */
export const getToken = async () => {
  const accounts = msalInstance.getAllAccounts();

  if (accounts.length === 0) {
    throw new Error("No accounts found. User is not logged in.");
  }

  try {
    // Attempt silent token acquisition
    const response = await msalInstance.acquireTokenSilent({
      ...loginRequest,
      account: accounts[0], // Use the first account
    });
    return response.accessToken;
  } catch (error) {
    console.warn("Silent token acquisition failed. Falling back to popup login.", error);

    // Fallback to interactive login
    const response = await msalInstance.acquireTokenPopup({
      ...loginRequest,
      account: accounts[0],
    });
    return response.accessToken;
  }
};

const refreshTokenIfNeeded = async () => {
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length === 0) {
      console.warn("No accounts available for token refresh.");
      return;
    }
  
    const account = accounts[0];
    const token = await msalInstance.acquireTokenSilent({
      ...loginRequest,
      account,
    });
  
    const expiresIn = (token.expiresOn.getTime() - Date.now()) / 1000; // Time in seconds
    if (expiresIn < 300) { // Refresh if less than 5 minutes left
      console.log("Token is about to expire. Refreshing...");
      await msalInstance.acquireTokenSilent({
        ...loginRequest,
        account,
      });
    }
  };
  
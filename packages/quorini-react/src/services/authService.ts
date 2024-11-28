import axios from 'axios';
import { QClient } from "@ernst1202/qui-core";

// Create an Axios instance with default config
const apiClient = axios.create({
  baseURL: QClient.getPrivate('authApiUrl'), // Default base URL; can override per request if needed
  headers: {
    'Content-Type': 'application/json',
  },
});

// login function
export const login = async (username: string, password: string) => {
  let result:any = null;
  try {
    const authApiUrl = QClient.getPrivate('authApiUrl');
    const projectId = QClient.getConfig().projectId;
    const projectEnvironment = QClient.getConfig().env;
    const response = await apiClient.post(`${authApiUrl}/${projectId}/log-in${projectEnvironment !== 'production' ? `?env=${projectEnvironment}` : ''}`, {
      authOption: { username, password },
    });
    if (response.status === 200 && response.data.accessToken) {
      result = response.data;
    }
    return result;
  } catch (error) {
    throw error;
  }
};

// signup function
export const signup = async (username: string, password: string) => {
  // try {
  //   const authApiUrl = QClient.getPrivate('authApiUrl');
  //   const response = await apiClient.post(`${authApiUrl}/sign-up`, {
  //     authOption: { username, password },
  //   });
  //   return response.data;
  // } catch (error) {
  //   throw error;
  // }
};

// Verify Email
export const verifyEmail = async (code: string, username: string) => {
  let result: any = null;
  try {
    const authApiUrl = QClient.getPrivate('authApiUrl');
    const projectId = QClient.getConfig().projectId;
    const projectEnvironment = QClient.getConfig().env;
    const response = await apiClient.get(`${authApiUrl}/${projectId}/verify-email?code=${code}&username=${username.replace("+", "%2B")}${projectEnvironment !== 'production' ? `?env=${projectEnvironment}` : ''}`);
    if (response.status === 200) result = response.data;
    return result;
  } catch (error) {
    throw error;
  }
};

// refresh auth token
export const refreshAuthToken = async (refreshToken: any) => {
  let result: any = null;
  try {
    const authApiUrl = QClient.getPrivate('authApiUrl');
    const projectId = QClient.getConfig().projectId;
    const projectEnvironment = QClient.getConfig().env;
    const response = await apiClient.post(`${authApiUrl}/${projectId}/refresh-token/${projectEnvironment !== 'production' ? `?env=${projectEnvironment}` : ''}`, {refreshToken});
    result = response.data;
    return result;
  } catch (error) {
    throw error;
  }
}

export const sendInvitation = async (email: string, userGroup: string, accessToken: any) => {
  let result: any = null;
  try {
    const authApiUrl = QClient.getPrivate('authApiUrl');
    const projectId = QClient.getConfig().projectId;
    const projectEnvironment = QClient.getConfig().env;
    const response = await apiClient.post(`${authApiUrl}/${projectId}/send-invitation${projectEnvironment !== 'production' ? `?env=${projectEnvironment}` : ''}`,
      {
        email,
        userGroup,
      },
      {
        headers: { 
          Authorization: accessToken,
        }
      }
    );
    result = response.data;
    return result;
  } catch (error) {
    throw error;
  }
}

export const acceptInvitation = async (email: string, password: string, code: string) => {
  let result: any = null;
  try {
    const authApiUrl = QClient.getPrivate('authApiUrl');
    const projectId = QClient.getConfig().projectId;
    const projectEnvironment = QClient.getConfig().env;
    const response = await apiClient.post(`${authApiUrl}/${projectId}/accept-invitation${projectEnvironment !== 'production' ? `?env=${projectEnvironment}` : ''}`,
      {
        authOption: {
          email,
          newPassword: password,
          invitationCode: code,
        }
      }
    );
    result = response.data;
    return result;
  } catch (error) {
    throw error;
  }
}
import axios from 'axios';
import { QClient } from "@ernst1202/qui-core";

// Create an Axios instance with default config
const apiClient = axios.create({
  baseURL: QClient.getPrivate('apiUrl'), // Default base URL; can override per request if needed
  headers: {
    'Content-Type': 'application/json',
  },
});

// login function
export const login = async (username: string, password: string) => {
  let result:any = null;
  try {
    const authApiUrl = QClient.getPrivate('authApiUrl');
    const response = await apiClient.post(`${authApiUrl}/log-in`, {
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
  try {
    const authApiUrl = QClient.getPrivate('authApiUrl');
    const response = await apiClient.post(`${authApiUrl}/sign-up`, {
      authOption: { username, password },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Verify Email
export const verifyEmail = async (code: string, username: string) => {
  let result: any = null;
  try {
    const authApiUrl = QClient.getPrivate('authApiUrl');
    const response = await apiClient.get(`${authApiUrl}/verify-email?code=${code}&username=${username.replace("+", "%2B")}`);
    if (response.status === 200) result = response.data;
    return result;
  } catch (error) {
    throw error;
  }
};
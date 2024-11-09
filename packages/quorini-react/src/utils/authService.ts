import axios from 'axios';
import { QClient } from '@ernst1202/qui-core';

const { authApiUrl } = QClient.getConfig();
export interface AuthResponse {
  token: string;
  user: { id: string; email: string; name: string };
}

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await axios.post(`${authApiUrl}/login`, { email, password });
  return response.data;
};

export const signup = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await axios.post(`${authApiUrl}/signup`, { email, password });
  return response.data;
};

export const verify = async (verificationCode: string): Promise<void> => {
  await axios.post(`${authApiUrl}/verify`, { verificationCode });
};

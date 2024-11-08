import axios from 'axios';
import { apiUrl } from '@ernst1202/qui-core';

export interface AuthResponse {
  token: string;
  user: { id: string; email: string; name: string };
}

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await axios.post(`${apiUrl}/login`, { email, password });
  return response.data;
};

export const signup = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await axios.post(`${apiUrl}/signup`, { email, password });
  return response.data;
};

export const verify = async (verificationCode: string): Promise<void> => {
  await axios.post(`${apiUrl}/verify`, { verificationCode });
};

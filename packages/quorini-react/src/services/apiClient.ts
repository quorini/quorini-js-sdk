import axios from 'axios';
import { QClient } from "@ernst1202/qui-core";

// Define base URLs using environment variables
// const QUORINI_API = process.env.REACT_APP_QUORINI_API;
// const QUORINI_AUTH_API = process.env.REACT_APP_QUORINI_AUTH_API;
// const CUSTOMER_API = process.env.REACT_APP_CUSTOMER_API;
// const CUSTOMER_AUTH_API = process.env.REACT_APP_CUSTOMER_AUTH_API;

const QUORINI_API = "https://nq3o4t9ax0.execute-api.us-west-2.amazonaws.com/development"
const QUORINI_AUTH_API = "https://vlpw2q6zt5.execute-api.us-west-2.amazonaws.com/development"
const CUSTOMER_API = "https://h5ti6dtzyl.execute-api.us-west-2.amazonaws.com/development"
const CUSTOMER_AUTH_API = "https://hth72i9z93.execute-api.us-west-2.amazonaws.com/development"

if (!QUORINI_API || !QUORINI_AUTH_API || !CUSTOMER_API || !CUSTOMER_AUTH_API) {
  console.warn("Some API environment variables are not defined.");
}

// Create an Axios instance with default config
const apiClient = axios.create({
  baseURL: QUORINI_API, // Default base URL; can override per request if needed
  headers: {
    'Content-Type': 'application/json',
  },
});

// Login function
export const login = async (username: string, password: string) => {
  try {
    const { authApiUrl } = QClient.getConfig();
    console.log("getConfig-auth-api-url", authApiUrl);
    // console.log("login-QUORINI_AUTH_API", QUORINI_AUTH_API);
    const response = await apiClient.post(`${authApiUrl}/log-in`, {
      authOption: { username, password },
    });
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

// Signup function
export const signup = async (username: string, password: string) => {
  try {
    console.log("signup-QUORINI_AUTH_API", QUORINI_AUTH_API)
    const response = await apiClient.post(`${QUORINI_AUTH_API}/sign-up`, {
        authOption: { username, password },
    });
    return response.data;
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
};

// Verify account function
export const verifyAccount = async (code: string) => {
//   try {
//     const response = await apiClient.post(`${CUSTOMER_AUTH_API}/verify`, {
//       code,
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Verification error:", error);
//     throw error;
//   }
};
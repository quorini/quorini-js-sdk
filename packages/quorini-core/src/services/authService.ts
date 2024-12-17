import axios from 'axios';
import { QClient } from '../config';
import { ApolloClient, HttpLink, InMemoryCache, gql } from '@apollo/client';
import { SESSION_KEY } from './gqlService';

const ignoreFields = ["_id", "createdAt", "updatedAt", "createdBy", "email", "invitedBy", "status"];

// Create an Axios instance with default config
const apiClient = axios.create({
  baseURL: QClient.getPrivate().authApiUrl, // Default base URL; can override per request if needed
  headers: {
    'Content-Type': 'application/json',
  },
});

// login function
export const login = async (username: string, password: string) => {
  let result:any = null;
  try {
    const authApiUrl = QClient.getPrivate().authApiUrl;
    const projectId = QClient.getConfig().projectId;
    const projectEnvironment = QClient.getConfig().env;
    const response = await apiClient.post(`${authApiUrl}/${projectId}/log-in${projectEnvironment === 'development' ? `?env=dev` : ''}`, {
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

const session = JSON.parse(localStorage.getItem(SESSION_KEY)!);

// Setup Apollo Client (assuming a GraphQL endpoint)
const client = new ApolloClient({
  link: new HttpLink({
    uri: `${QClient.getPrivate().apiUrl}/${QClient.getConfig().projectId}/gql${QClient.getConfig().env === 'development' ? `?env=dev` : ''}`,
    headers: {
      Authorization: `${session?.accessToken}`,
    },
  }),
  cache: new InMemoryCache({
    addTypename: false,
  }),
});

// Function to introspect the mutation fields and extract input types
function getMutationInputType(mutationQuery: any) {
  // You need to extract the query details, such as input types, from the mutation
  const inputType = mutationQuery?.variables?.input?.type || null;
  return inputType;
}

// Function to get fields for the extracted input type
function getInputTypeFields(inputType: string) {
  // You can query the schema for the fields inside the input type (e.g., 'createCustomerInput')
  const GET_INPUT_TYPE_FIELDS = gql`
    query {
      __type(name: "${inputType}") {
        fields {
          name
          type {
            name
            kind
          }
        }
      }
    }
  `;
  
  return client.query({ query: GET_INPUT_TYPE_FIELDS })
    .then(result => result.data.__type.fields);
}

// Inside your SDK, once you have the mutation query
function introspectMutation(mutationQuery: any) {
  // Introspect the mutation query to extract the input type name (e.g., createCustomerInput)
  const inputType = getMutationInputType(mutationQuery);
  if (inputType) {
    getInputTypeFields(inputType).then(fields => {
      console.log(fields);  // Fields will contain the data for the input type (e.g., firstName, lastName)
    });
  }
}

// signup function
export const signup = async (username: string, password: string) => {
  // Example usage of the introspection
  const mutationQuery = QClient.getConfig().signupMutation;
  console.log("mutationQuery", mutationQuery)
  introspectMutation(mutationQuery);

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
    const authApiUrl = QClient.getPrivate().authApiUrl;
    const projectId = QClient.getConfig().projectId;
    const projectEnvironment = QClient.getConfig().env;
    const response = await apiClient.get(`${authApiUrl}/${projectId}/verify-email?code=${code}&username=${username.replace("+", "%2B")}${projectEnvironment === 'development' ? `?env=dev` : ''}`);
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
    const authApiUrl = QClient.getPrivate().authApiUrl;
    const projectId = QClient.getConfig().projectId;
    const projectEnvironment = QClient.getConfig().env;
    const response = await apiClient.post(`${authApiUrl}/${projectId}/refresh-token/${projectEnvironment === 'development' ? `?env=dev` : ''}`, {refreshToken});
    result = response.data;
    return result;
  } catch (error) {
    throw error;
  }
}

export const sendInvitation = async (email: string, userGroup: string, accessToken: any) => {
  let result: any = null;
  try {
    const authApiUrl = QClient.getPrivate().authApiUrl;
    const projectId = QClient.getConfig().projectId;
    const projectEnvironment = QClient.getConfig().env;
    const response = await apiClient.post(`${authApiUrl}/${projectId}/send-invitation${projectEnvironment === 'development' ? `?env=dev` : ''}`,
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
    const authApiUrl = QClient.getPrivate().authApiUrl;
    const projectId = QClient.getConfig().projectId;
    const projectEnvironment = QClient.getConfig().env;
    const response = await apiClient.post(`${authApiUrl}/${projectId}/accept-invitation${projectEnvironment === 'development' ? `?env=dev` : ''}`,
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
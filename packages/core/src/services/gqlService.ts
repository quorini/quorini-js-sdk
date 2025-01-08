import { ApolloClient, InMemoryCache, HttpLink, gql, OperationVariables } from '@apollo/client';
import { QClient } from '../config';

export const SESSION_KEY = 'session';

export const query = async <VarsType extends OperationVariables, ResponseType>(
  baseQuery: string,
  variables?: VarsType,
  selectors?: string
): Promise<ResponseType> => {
  const session = JSON.parse(localStorage.getItem(SESSION_KEY)!);

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

  // Ensure selectors are valid
  if (selectors && !/^[a-zA-Z0-9_ ]+$/.test(selectors)) {
    throw new Error("Invalid selectors format.");
  }

  // Replace the selection set with selectors if provided
  const gqlQueryString = selectors
    ? baseQuery.replace(
        /{([^{}]*)}/, // Match the inner selection set content
        `{ ${selectors.trim()} }` // Safely inject the selectors
      )
    : baseQuery;

  // Parse the updated query string
  const gqlQuery = gql(gqlQueryString);

  // Ensure variables are never undefined
  const safeVariables = variables ?? ({} as VarsType);

  try {
    const response = await client.query<ResponseType, VarsType>({
      query: gqlQuery,
      variables: safeVariables,
      fetchPolicy: "no-cache",
    });
    return response.data as ResponseType;
  } catch (error) {
    console.error('Apollo Query Error:', error);
    throw error;
  }
};

export const mutate = async <VarsType extends OperationVariables, ResponseType>(
  baseMutation: string,
  variables: VarsType,
): Promise<ResponseType> => {
  const session = JSON.parse(localStorage.getItem(SESSION_KEY)!);

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

  const mutation = gql(baseMutation);

  try {
    const response = await client.mutate<ResponseType, VarsType>({
      mutation,
      variables,
    });

    if (!response.data) {
      throw new Error(`Mutation response data for "${baseMutation}" is null or undefined.`);
    }

    return response.data as ResponseType;
  } catch (error) {
    console.error(`Error during mutation "${baseMutation}":`, error);
    throw error;
  }
};
import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { ApolloClient, InMemoryCache, HttpLink, gql, OperationVariables } from '@apollo/client';
import { QClient } from '@ernst1202/qui-core';
import { QGqlContextType } from './QGql.types';
import { useAuth } from '../../hooks';

// Create a context for GraphQL operations
const QGqlContext = createContext<QGqlContextType | undefined>(undefined);

// Provider component to wrap your app
export const QGqlProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth(); // Access the user object from useAuth hook
  const [client, setClient] = useState<ApolloClient<any> | null>(null);

  useEffect(() => {
    if (user?.accessToken) {
      const client = new ApolloClient({
        link: new HttpLink({
          uri: `${QClient.getPrivate('apiUrl')}/${QClient.getConfig().projectId}/gql${QClient.getConfig().env !== 'production' ? `?env=${QClient.getConfig().env}` : ''}`,
          headers: {
            Authorization: `${user.accessToken}`,
          },
        }),
        cache: new InMemoryCache({
          addTypename: false,
        }),
        // connectToDevTools: true,
      });
      setClient(client);
    }
  }, [user?.accessToken]);

  if (!client) {
    return <div>Loading...</div>; // Render loading state until client is set up
  }

  const query = async <VarsType extends OperationVariables, ResponseType>(
    baseQuery: string,
    variables?: VarsType,
    selectors?: string
  ): Promise<ResponseType> => {

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
      return response.data;
    } catch (error) {
      console.error('Apollo Query Error:', error);
      throw error;
    }
  };

  const mutate = async <VarsType extends OperationVariables, ResponseType>(
    baseMutation: string,
    variables: VarsType,
  ): Promise<ResponseType> => {
    const mutation = gql(baseMutation);

    try {
      const response = await client.mutate<ResponseType, VarsType>({
        mutation,
        variables,
      });

      if (!response.data) {
        throw new Error(`Mutation response data for "${baseMutation}" is null or undefined.`);
      }

      return response.data;
    } catch (error) {
      console.error(`Error during mutation "${baseMutation}":`, error);
      throw error;
    }
  };

  return (
    <QGqlContext.Provider value={{ query, mutate }}>
      {children}
    </QGqlContext.Provider>
  );
};

const QGql = {
  Provider: QGqlProvider,
};

export { QGql, QGqlContext };

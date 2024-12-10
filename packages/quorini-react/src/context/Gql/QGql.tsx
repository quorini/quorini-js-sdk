import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { ApolloClient, InMemoryCache, HttpLink, gql, OperationVariables, DefaultOptions } from '@apollo/client';
import { QClient } from '@ernst1202/qui-core';
import { QGqlContextType } from './QGql.types';
import { useAuth } from '../../hooks';

// Create a context for GraphQL operations
const QGqlContext = createContext<QGqlContextType | undefined>(undefined);

// Extend the DefaultOptions type to include addTypename
const defaultOptions = {
  mutate: {
    addTypename: false // Disable __typename globally for mutations
  }
} as any;

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
          addTypename: false, // Disable typename globally
        }),
        connectToDevTools: true,
        defaultOptions,
      });
      setClient(client);
    }
  }, [user?.accessToken]);

  if (!client) {
    return <div>Loading...</div>; // Render loading state until client is set up
  }

  const loadOperation = async (
    type: 'queries' | 'mutations',
    operationName: string
  ): Promise<string> => {
    const gqlPaths = QClient.getConfig().gqlPaths;
    console.log("gqlPaths", JSON.stringify(gqlPaths));
    const operations = type === 'queries' ? gqlPaths?.queries : gqlPaths?.mutations;
    console.log("operations", operations);
  
    if (!operations || !operations[operationName]) {
      throw new Error(`Operation "${operationName}" not found in ${type}.`);
    }
  
    const operation = operations[operationName];
    return operation;
  };

  const query = async <VarsType extends OperationVariables, ResponseType>(
    queryStr: string,
    variables?: VarsType,
    selectors?: string
  ): Promise<ResponseType> => {
    const operation = queryStr;

    const gqlQuery = gql(
      selectors
        ? operation.replace(/{[^}]*}/, `{ ${selectors} }`)
        : operation
    );

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
    mutationStr: string,
    variables: VarsType,
  ): Promise<ResponseType> => {
    const operation = mutationStr;
    const mutation = gql(operation);

    try {
      const response = await client.mutate<ResponseType, VarsType>({
        mutation,
        variables,
      });

      if (!response.data) {
        throw new Error(`Mutation response data for "${mutationStr}" is null or undefined.`);
      }

      return response.data;
    } catch (error) {
      console.error(`Error during mutation "${mutationStr}":`, error);
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

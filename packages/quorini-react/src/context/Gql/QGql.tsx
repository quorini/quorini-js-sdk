import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { ApolloClient, InMemoryCache, HttpLink, gql } from '@apollo/client';
import { QClient } from '@ernst1202/qui-core';
import { QGqlContextType, OperationVariables, OperationWithParams } from './QGql.types';
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
        cache: new InMemoryCache(),
      });
      setClient(client);
    }
  }, [user?.accessToken]);

  if (!client) {
    return <div>Loading...</div>; // Render loading state until client is set up
  }

  const loadOperation = async <VarsType extends OperationVariables, ResponseType>(
    type: 'queries' | 'mutations',
    operationName: string
  ): Promise<string> => {
    const gqlPaths = QClient.getConfig().gqlPaths;
    console.log("gqlPaths", JSON.stringify(gqlPaths));
    const operations = type === 'queries' ? gqlPaths?.queries : gqlPaths?.mutations;
    console.log()
  
    if (!operations || !operations[operationName]) {
      throw new Error(`Operation "${operationName}" not found in ${type}.`);
    }
  
    const operation = operations[operationName];
    // return operation as OperationWithParams<VarsType, ResponseType>;
    return operation;
  };

  const query = async <VarsType extends OperationVariables, ResponseType>(
    operationName: string,
    variables?: VarsType,
    selectors?: string
  ): Promise<ResponseType> => {
    const operation = await loadOperation<VarsType, ResponseType>('queries', operationName);

    const gqlQuery = gql(
      selectors
        ? operation.replace(/{[^}]*}/, `{ ${selectors} }`)
        : operation
    );

    // Ensure variables are never undefined
    const safeVariables = variables ?? ({} as VarsType);

    const response = await client.query<ResponseType, VarsType>({
      query: gqlQuery,
      variables: safeVariables,
    });

    return response.data;
  };

  const mutate = async <VarsType extends OperationVariables, ResponseType>(
    operationName: string,
    variables: VarsType
  ): Promise<ResponseType> => {
    const operation = await loadOperation<VarsType, ResponseType>('mutations', operationName);

    const mutation = gql(operation);

    try {
      const response = await client.mutate<ResponseType, VarsType>({
        mutation,
        variables,
      });

      if (!response.data) {
        throw new Error(`Mutation response data for "${operationName}" is null or undefined.`);
      }

      return response.data;
    } catch (error) {
      console.error(`Error during mutation "${operationName}":`, error);
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

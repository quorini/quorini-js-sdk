import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { ApolloClient, InMemoryCache, HttpLink, gql } from '@apollo/client';
import { QClient } from '@ernst1202/qui-core';
import { QGqlContextType, OperationVariables, OperationWithParams } from './QGql.types';
import { useAuth } from '../../hooks';
import path from 'path';

// Fallback paths for queries and mutations
const DEFAULT_QUERIES_PATH = './src/generated/queries';
const DEFAULT_MUTATIONS_PATH = './src/generated/mutations';

const baseUri = QClient.getPrivate('apiUrl');
const projectId = QClient.getConfig().projectId;
const env = QClient.getConfig().env;
const gqlQueriesPath = QClient.getConfig().gqlPaths?.queries || DEFAULT_QUERIES_PATH;
const gqlMutationsPath = QClient.getConfig().gqlPaths?.mutations || DEFAULT_MUTATIONS_PATH;

// Create a context for GraphQL operations
const QGqlContext = createContext<QGqlContextType | undefined>(undefined);

// const client = new ApolloClient({
//   link: new HttpLink({
//     uri: `${baseUri}/${projectId}/gql${env !== 'production' ? `?env=${env}` : ''}`,
//     headers: {
//       Authorization: `${useAuth().user.accessToken}`,
//     },
//   }),
//   cache: new InMemoryCache(),
// });

// Provider component to wrap your app
export const QGqlProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth(); // Access the user object from useAuth hook
  const [client, setClient] = useState<ApolloClient<any> | null>(null);

  useEffect(() => {
    if (user?.accessToken) {
      const client = new ApolloClient({
        link: new HttpLink({
          uri: `${baseUri}/${projectId}/gql${env !== 'production' ? `?env=${env}` : ''}`,
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

  const resolvePath = (type: 'queries' | 'mutations') => {
    return path.resolve(type === 'queries' ? gqlQueriesPath : gqlMutationsPath);
  };

  const loadOperation = <VarsType extends OperationVariables, ResponseType>(
    type: 'queries' | 'mutations',
    operationName: string
  ): OperationWithParams<VarsType, ResponseType> => {
    try {
      const operations = require(resolvePath(type));
      const operation = operations[operationName];
      if (!operation) {
        throw new Error(`Operation "${operationName}" not found in ${type}.`);
      }
      return operation as OperationWithParams<VarsType, ResponseType>;;
    } catch (error: any) {
      throw new Error(`Failed to load ${type}: ${error.message}`);
    }
  };

  const query = async <VarsType extends OperationVariables, ResponseType>(
    operationName: string,
    variables?: VarsType,
    selectors?: string
  ): Promise<ResponseType> => {
    const operation = loadOperation<VarsType, ResponseType>('queries', operationName);

    const query = gql(
      selectors
        ? operation.replace(/{[^}]*}/, `{ ${selectors} }`)
        : operation
    );

    const response = await client.query<ResponseType, VarsType>({
      query,
      variables,
    });

    return response.data;
  };

  const mutate = async <VarsType extends OperationVariables, ResponseType>(
    operationName: string,
    variables: VarsType
  ): Promise<ResponseType> => {
    const operation = loadOperation<VarsType, ResponseType>('mutations', operationName);

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

export { QGql, QGqlContext }
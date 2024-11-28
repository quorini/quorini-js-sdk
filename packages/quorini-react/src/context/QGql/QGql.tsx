import React, { createContext, useContext, ReactNode } from 'react';
import { ApolloClient, InMemoryCache, HttpLink, gql } from '@apollo/client';
import { QClient } from '@ernst1202/qui-core';
import { QGqlContextType, OperationVariables, OperationWithParams } from './QGql.types';
import { useAuth } from '../../hooks';

const baseUri = QClient.getPrivate('apiUrl');
const projectId = QClient.getConfig().projectId;
const env = QClient.getConfig().env;

const client = new ApolloClient({
  link: new HttpLink({
    uri: `${baseUri}/${projectId}/gql${env !== 'production' ? `?env=${env}` : ''}`,
    headers: {
      Authorization: `${useAuth().user.accessToken}`,
    },
  }),
  cache: new InMemoryCache(),
});

// Create a context for GraphQL operations
const QGqlContext = createContext<QGqlContextType | undefined>(undefined);

// Provider component to wrap your app
export const QGqlProvider = ({ children }: { children: ReactNode }) => {
  const query = async <VarsType extends OperationVariables, ResponseType>(
    operationName: string,
    variables?: VarsType,
    selectors?: string
  ): Promise<ResponseType> => {
    const operation: OperationWithParams<VarsType, ResponseType> = require(`generated/queries`)[operationName];
    if (!operation) {
      throw new Error(`Operation "${operationName}" not found.`);
    }

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
    const operation: OperationWithParams<VarsType, ResponseType> | undefined = require(`generated/mutations`)[operationName];
    
    if (!operation) {
      throw new Error(`Operation "${operationName}" not found.`);
    }
  
    const mutation = gql(operation);
  
    try {
      const response = await client.mutate<ResponseType, VarsType>({
        mutation,
        variables,
      });
  
      // Ensuring response.data is not null or undefined before returning
      if (response.data === null || response.data === undefined) {
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

// Custom hook to access the QGqlContext
export const useQGql = (): QGqlContextType => {
  const context = useContext(QGqlContext);
  if (!context) {
    throw new Error('useQGql must be used within a QGqlProvider');
  }
  return context;
};

import React, { createContext, ReactNode } from 'react';
import * as GqlService from '@quorini/qui-core';
import { QGqlContextType } from './QGql.types';

// Create a context for GraphQL operations
const QGqlContext = createContext<QGqlContextType | undefined>(undefined);

// Provider component to wrap your app
export const QGqlProvider = ({ children }: { children: ReactNode }) => (
  <QGqlContext.Provider value={{ query: GqlService.query, mutate: GqlService.mutate }}>
    {children}
  </QGqlContext.Provider>
);

const QGql = {
  Provider: QGqlProvider,
};

export { QGql, QGqlContext };

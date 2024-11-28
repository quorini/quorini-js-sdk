export type OperationVariables = Record<string, any>; // Any variables for GraphQL operations

export type GraphQLString = string; // A GraphQL operation is a string

export type OperationWithParams<
  VarsType extends OperationVariables = OperationVariables,
  ResponseType = any
> = GraphQLString;

export type QGqlContextType = {
  query: <VarsType extends OperationVariables, ResponseType>(
    operationName: string,
    variables?: VarsType,
    selectors?: string
  ) => Promise<ResponseType>;
  mutate: <VarsType extends OperationVariables, ResponseType>(
    operationName: string,
    variables: VarsType
  ) => Promise<ResponseType>;
};

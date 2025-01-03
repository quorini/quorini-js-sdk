import { OperationVariables } from "@apollo/client";

export interface ResponseType {
  [key: string]: any;
}

export interface QGqlContextType {
  query<VarsType extends OperationVariables, ResponseType>(
    operationName: string,
    variables?: VarsType,
    selectors?: string
  ): Promise<ResponseType>;
  mutate<VarsType extends OperationVariables, ResponseType>(
    operationName: string,
    variables: VarsType,
  ): Promise<ResponseType>;
}

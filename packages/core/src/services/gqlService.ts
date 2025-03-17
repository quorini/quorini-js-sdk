import { ApolloClient, InMemoryCache, HttpLink, gql, OperationVariables } from '@apollo/client';
import { QClient } from '../config';
import { SESSION_KEY } from '.';
import { parse, print, FieldNode, SelectionSetNode, Kind, DocumentNode, OperationDefinitionNode, NameNode } from 'graphql';

// Function to extract allowed fields from selector input
const parseSelectors = (selectors: string): Record<string, any> => {
  const result: Record<string, any> = {};
  const stack: Record<string, any>[] = [result];

  selectors
    .trim()
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .forEach((line) => {
      if (line.endsWith('{')) {
        const fieldName = line.replace('{', '').trim();
        stack[stack.length - 1][fieldName] = {};
        stack.push(stack[stack.length - 1][fieldName]);
      } else if (line === '}') {
        stack.pop();
      } else {
        stack[stack.length - 1][line] = true;
      }
    });

  return result;
};

// Function to filter or modify a SelectionSetNode based on allowed fields
const filterSelectionSet = (selectionSet: SelectionSetNode, allowedFields: Record<string, any>): SelectionSetNode => {
  const filteredSelections = selectionSet.selections
    .map((selection) => {
      if (selection.kind === Kind.FIELD) {
        const field = selection as FieldNode;
        const fieldName = field.name.value;

        if (allowedFields[fieldName]) {
          // If the field is allowed and has nested fields in allowedFields
          if (field.selectionSet && typeof allowedFields[fieldName] === 'object' && Object.keys(allowedFields[fieldName]).length > 0) {
            return {
              ...field,
              selectionSet: filterSelectionSet(field.selectionSet, allowedFields[fieldName]),
            };
          }
          // If the field is allowed and no nested fields are specified, keep it as is (leaf field)
          return field;
        }
      }
      return null; // Remove unallowed fields
    })
    .filter((selection) => selection !== null);

  return {
    kind: Kind.SELECTION_SET,
    selections: filteredSelections,
  } as SelectionSetNode;
};

// (auth) query function
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

  let gqlQueryString = baseQuery;

  if (selectors) {
    try {
      // Parse the base query into an AST
      const ast: DocumentNode = parse(baseQuery);

      // Parse the selectors into a nested object
      const allowedFields = parseSelectors(selectors);

      // Modify the AST based on the allowed fields
      const modifiedAst: DocumentNode = {
        ...ast,
        definitions: ast.definitions.map((definition) => {
          if (definition.kind === Kind.OPERATION_DEFINITION) {
            const opDef = definition as OperationDefinitionNode;

            // Assume the first selection is the main query field (e.g., "listListings")
            const mainSelection = opDef.selectionSet.selections[0] as FieldNode;

            if (mainSelection && mainSelection.selectionSet) {
              // Filter the selection set based on the allowed fields
              const filteredSelectionSet = filterSelectionSet(mainSelection.selectionSet, allowedFields);

              return {
                ...opDef,
                selectionSet: {
                  ...opDef.selectionSet,
                  selections: [
                    {
                      ...mainSelection,
                      selectionSet: filteredSelectionSet,
                    },
                  ],
                },
              };
            }
          }
          return definition;
        }),
      };

      // Convert the modified AST back to a string
      gqlQueryString = print(modifiedAst);
    } catch (error) {
      console.error('Error parsing GraphQL query or selectors:', error);
      throw new Error('Invalid GraphQL query or selectors format.');
    }
  }

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

    if (!response.data) {
      throw new Error(`Query response data for "${baseQuery}" is null or undefined.`);
    }
    
    // Unwrap the first level of the response.data
    return Object.values(response.data)[0] as ResponseType;
  } catch (error) {
    console.error('Apollo Query Error:', error);
    throw error;
  }
};

// (auth) mutate function
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

    // Unwrap the first level of the response.data
    return Object.values(response.data)[0] as ResponseType;
  } catch (error) {
    console.error(`Error during mutation "${baseMutation}":`, error);
    throw error;
  }
};

// Public (no-auth) query function
export const publicQuery = async <VarsType extends OperationVariables, ResponseType>(
  baseQuery: string,
  variables?: VarsType,
  selectors?: string
): Promise<ResponseType> => {
  const client = new ApolloClient({
    link: new HttpLink({
      uri: `${QClient.getPrivate().apiUrl}/${QClient.getConfig().projectId}/public/gql${QClient.getConfig().env === 'development' ? `?env=dev` : ''}`, // Adjust URI for public endpoint
    }),
    cache: new InMemoryCache({
      addTypename: false,
    }),
  });

  let gqlQueryString = baseQuery;

  if (selectors) {
    try {
      const ast: DocumentNode = parse(baseQuery);
      const allowedFields = parseSelectors(selectors);

      const modifiedAst: DocumentNode = {
        ...ast,
        definitions: ast.definitions.map((definition) => {
          if (definition.kind === Kind.OPERATION_DEFINITION) {
            const opDef = definition as OperationDefinitionNode;
            const mainSelection = opDef.selectionSet.selections[0] as FieldNode;

            if (mainSelection && mainSelection.selectionSet) {
              const filteredSelectionSet = filterSelectionSet(mainSelection.selectionSet, allowedFields);

              return {
                ...opDef,
                selectionSet: {
                  ...opDef.selectionSet,
                  selections: [
                    {
                      ...mainSelection,
                      selectionSet: filteredSelectionSet,
                    },
                  ],
                },
              };
            }
          }
          return definition;
        }),
      };

      gqlQueryString = print(modifiedAst);
    } catch (error) {
      console.error('Error parsing GraphQL query or selectors:', error);
      throw new Error('Invalid GraphQL query or selectors format.');
    }
  }

  const gqlQuery = gql(gqlQueryString);
  const safeVariables = variables ?? ({} as VarsType);

  try {
    const response = await client.query<ResponseType, VarsType>({
      query: gqlQuery,
      variables: safeVariables,
      fetchPolicy: 'no-cache',
    });

    if (!response.data) {
      throw new Error(`Query response data for "${baseQuery}" is null or undefined.`);
    }

    // Unwrap the first level of the response.data
    return Object.values(response.data)[0] as ResponseType;
  } catch (error) {
    console.error('Apollo Public Query Error:', error);
    throw error;
  }
};

// Public (no-auth) mutation function
export const publicMutate = async <VarsType extends OperationVariables, ResponseType>(
  baseMutation: string,
  variables: VarsType
): Promise<ResponseType> => {
  const client = new ApolloClient({
    link: new HttpLink({
      uri: `${QClient.getPrivate().apiUrl}/${QClient.getConfig().projectId}/public/gql${QClient.getConfig().env === 'development' ? `?env=dev` : ''}`, // Adjust URI for public endpoint
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
      throw new Error(`Public mutation response data for "${baseMutation}" is null or undefined.`);
    }

    // Unwrap the first level of the response.data
    return Object.values(response.data)[0] as ResponseType;
  } catch (error) {
    console.error(`Error during public mutation "${baseMutation}":`, error);
    throw error;
  }
};
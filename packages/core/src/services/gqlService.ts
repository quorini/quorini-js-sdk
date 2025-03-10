import { ApolloClient, InMemoryCache, HttpLink, gql, OperationVariables } from '@apollo/client';
import { QClient } from '../config';
import { SESSION_KEY } from '.';
import { parse, print, FieldNode, SelectionSetNode, Kind, DocumentNode, OperationDefinitionNode, NameNode } from 'graphql';

// Function to transform a selectors string into an AST SelectionSet
const parseSelectors = (selectors: string): SelectionSetNode => {
  const lines = selectors
    .trim()
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const parseFields = (lines: string[]): FieldNode[] => {
    const fields: FieldNode[] = [];
    const fieldStack: { field: FieldNode; selections: FieldNode[] }[] = [];

    lines.forEach((line) => {
      const match = line.match(/^([\w_]+)\s*:\s*\{$/); // Match "fieldName : {"
      const isClosingBracket = line === '}';

      if (match) {
        // Start of a nested object
        const newField: FieldNode = {
          kind: Kind.FIELD,
          name: { kind: Kind.NAME, value: match[1] } as NameNode,
          selectionSet: { kind: Kind.SELECTION_SET, selections: [] },
        };

        if (fieldStack.length > 0) {
          const parent = fieldStack[fieldStack.length - 1];
          parent.selections = [...parent.selections, newField]; // Create new array to avoid readonly error
        } else {
          fields.push(newField);
        }

        fieldStack.push({ field: newField, selections: [] });
      } else if (isClosingBracket) {
        // End of nested object
        const completedField = fieldStack.pop();
        if (completedField) {
          // Create a new updated field object instead of modifying selectionSet directly
          const updatedField: FieldNode = {
            ...completedField.field,
            selectionSet: {
              ...completedField.field.selectionSet!,
              selections: completedField.selections,
            },
          };

          if (fieldStack.length > 0) {
            const parent = fieldStack[fieldStack.length - 1];
            parent.selections = [...parent.selections, updatedField]; // Ensure new array assignment
          } else {
            fields.push(updatedField);
          }
        }
      } else {
        // Regular field
        const fieldNode: FieldNode = { kind: Kind.FIELD, name: { kind: Kind.NAME, value: line } as NameNode };

        if (fieldStack.length > 0) {
          const parent = fieldStack[fieldStack.length - 1];
          parent.selections = [...parent.selections, fieldNode]; // Create new array
        } else {
          fields.push(fieldNode);
        }
      }
    });

    return fields;
  };

  return { kind: Kind.SELECTION_SET, selections: parseFields(lines) };
};

export const query = async <VarsType extends OperationVariables, ResponseType>(
  baseQuery: string,
  variables?: VarsType,
  selectors?: string
): Promise<ResponseType> => {
  const session = JSON.parse(localStorage.getItem(SESSION_KEY)!);
  console.log("SDK-query-baseQuery", baseQuery);
  console.log("SDK-query-variables", variables);
  console.log("SDK-query-selectors", selectors);

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

  // Ensure selectors are valid
  if (selectors) {
    try {
      // if (!/^[a-zA-Z0-9_ ]+$/.test(selectors)) {
      //   throw new Error("Invalid selectors format."); 
      // }
      // Parse the base query
      const ast: DocumentNode = parse(baseQuery);

      // Modify the selection set dynamically by creating a new AST
      const modifiedAst: DocumentNode = {
        ...ast,
        definitions: ast.definitions.map((definition) => {
          if (definition.kind === Kind.OPERATION_DEFINITION) {
            const opDef = definition as OperationDefinitionNode;
            return {
              ...opDef,
              selectionSet: parseSelectors(selectors), // Replace selectionSet with a new object
            };
          }
          return definition;
        }),
      };

      // Convert back to a string query
      gqlQueryString = print(modifiedAst);
    } catch (error) {
      console.error('Error parsing GraphQL query:', error);
      throw new Error('Invalid GraphQL query format.');
    }
  }

  // // Replace the selection set with selectors if provided
  // const gqlQueryString = selectors
  //   ? baseQuery.replace(
  //       /{([^{}]*)}/, // Match the inner selection set content
  //       `{ ${selectors.trim()} }` // Safely inject the selectors
  //     )
  //   : baseQuery;
  
  console.log("SDK-gqlQueryString", gqlQueryString);

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
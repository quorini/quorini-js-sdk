// export type Schema = { [key: string]: string };

export type MetaData = {
  name: string;
  required: boolean;
  label: string;
  placeholder: string;
  type: string;
}

// export const parseSchema = (schema: Schema) => {
//   const mandatoryFields: { [key: string]: string } = {};
//   const optionalFields: { [key: string]: string } = {};

//   Object.entries(schema).forEach(([key, value]) => {
//     if (value.endsWith("?")) {
//       // Optional fields have "?" at the end of the type
//       optionalFields[key] = value.replace("?", ""); // Remove the "?" to get the type
//     } else {
//       // Mandatory fields
//       mandatoryFields[key] = value;
//     }
//   });

//   return { mandatoryFields, optionalFields };
// }

// export const generateObjectType = (schema: Schema): string => {
//   const lines = Object.entries(schema).map(([key, value]) => {
//     const isOptional = value.endsWith("?");
//     const dataType = value.replace("?", ""); // Remove the "?" for optional fields
//     return isOptional ? `${key}?: ${dataType};` : `${key}: ${dataType};`;
//   });

//   return `{\n  ${lines.join("\n  ")}\n}`;
// }

// export const generateFormFields = (dataType: Record<string, any>) => {
//   return Object.entries(dataType).map(([key, value]) => ({
//     name: key,
//     required: !key.endsWith('?'), // Use convention or custom logic for optional fields
//     label: key.replace('?', ''), // Remove "?" if it's part of the key
//     placeholder: `Enter your ${key.replace('?', '')}`,
//     type: typeof value === 'string' ? 'string' : 'other', // Adjust for other data types
//   }));
// }

export const parseSchemaToFormFields = (schema: Record<string, string>): MetaData[] => {
  return Object.entries(schema).map(([key, value]) => {
    const isOptional = value.endsWith('?');
    return {
      name: key,
      required: !isOptional,
      label: key.charAt(0).toUpperCase() + key.slice(1),
      placeholder: `Enter your ${key.charAt(0).toUpperCase() + key.slice(1)}`,
      type: value.replace('?', ''), // Remove "?" to identify the base type
    };
  });
};


export type MetaData = {
  name: string;
  required: boolean;
  label: string;
  placeholder: string;
  type: string;
}

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


export type Metadata = {
  requiredFields: string[];
  optionalFields: string[];
  protectedFields: string[];
  deprecatedFields: string[];
  fieldTypes: Record<string, string>;
  enumFields: Record<string, string[]>;
};

export function extractMetadata<T extends Record<string, any>>(schema: T): Metadata {
  const requiredFields: string[] = [];
  const optionalFields: string[] = [];
  const protectedFields: string[] = [];
  const deprecatedFields: string[] = [];
  const fieldTypes: Record<string, string> = {};
  const enumFields: Record<string, string[]> = {};

  for (const [key, value] of Object.entries(schema)) {
    const valueType = typeof value === "string" ? value : typeof value;

    // Handle protected and deprecated fields
    if (valueType.includes("protected")) {
      protectedFields.push(key);
    }
    if (valueType.includes("deprecated")) {
      deprecatedFields.push(key);
    }

    // Detect enum fields (like 'status')
    if (Array.isArray(value)) {
      enumFields[key] = value;
    }

    // Store the field type
    fieldTypes[key] = valueType;

    // Classify fields as required or optional
    if (key.endsWith("?")) {
      optionalFields.push(key.replace("?", ""));
    } else {
      requiredFields.push(key);
    }
  }

  return { requiredFields, optionalFields, protectedFields, deprecatedFields, fieldTypes, enumFields };
}

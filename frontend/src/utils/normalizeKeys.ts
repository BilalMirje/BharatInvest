/**
 * Recursively converts all object keys to camelCase.
 * Handles snake_case and PascalCase keys from API responses.
 */
export function normalizeKeys(obj: any): any {
  if (typeof obj !== 'object' || obj === null) return obj;
  if (Array.isArray(obj)) return obj.map(normalizeKeys);
  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key
      .replace(/[-_]([a-z])/g, (_, c: string) => c.toUpperCase())
      .replace(/^([A-Z])/, (c) => c.toLowerCase());
    result[camelKey] = normalizeKeys(value);
  }
  return result;
}

export const isPresent = v => v !== null && v !== undefined;

export const toString = (value) => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  if (typeof value.toString === 'function') return value.toString();
  return '';
};

export const toInteger = (value, defaultValue = 0) => {
  if (value === null || value === undefined) return defaultValue;
  return parseInt(value, 10);
};

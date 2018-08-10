export const isPresent = v => v !== null && v !== undefined;

export const toString = (value, defaultValue = '') => {
  if (!isPresent(value)) return defaultValue;
  if (typeof value === 'string') return value;
  if (typeof value.toString === 'function') return value.toString();
  return defaultValue;
};

export const toInteger = (value, defaultValue = 0) =>
  (isPresent(value) ? parseInt(value, 10) : defaultValue);

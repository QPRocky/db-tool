const isJson = (str: string): boolean => {
  if (typeof str !== 'string') return false;

  const trimmed = str.trim();
  return trimmed.startsWith('{') && trimmed.endsWith('}');
};

export default isJson;

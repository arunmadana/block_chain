export const getStorage = (key: any) => {
  return localStorage.getItem(key);
};

export const setStorage = (key: any, value: any) => {
  return localStorage.setItem(key, value);
};

export const clearStorage = (key: any) => {
  return localStorage.removeItem(key);
};

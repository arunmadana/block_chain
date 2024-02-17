// Convert the file size to a readable format
export const formatFileSize = function (bytes) {
  const sufixes = ['b', 'kb', 'mb', 'gb', 'tb'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sufixes[i]}`;
};

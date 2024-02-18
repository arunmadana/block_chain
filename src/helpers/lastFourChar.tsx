export default function lastFourChar(str) {
  if (!str) return '';
  if (str.length <= 4) return;
  return str.slice(str.length - 4);
}

export function lastFourDigit(str) {
  if (!str) return '';
  return str.replace(/.(?=.{4})/g, '•');
}

export function textEllipsis(text, length) {
  if (!text) return "";
  if (text?.length <= length) return text;
  return `${text?.slice(0, length)}...`;
}

export default function codeToString(code) {
  const codeStr = code.toString();
  const finalCode = codeStr.replace(/,/g, '');

  return finalCode;
}

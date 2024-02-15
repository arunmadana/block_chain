export default function capitalizeFirstLetter(string: string) {
  if (
    string === null ||
    string === undefined ||
    string === '---' ||
    string === ' '
  ) {
    return null;
  }
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}
// to capitalize every first letter of the phrase,  we can use titleCase.
export function titleCase(str: string) {
  if (str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
      // You do not need to check if i is larger than splitStr length, as your for does that for you
      // Assign it back to the array
      splitStr[i] =
        splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    // Directly return the joined string
    return splitStr.join(' ');
  }
}

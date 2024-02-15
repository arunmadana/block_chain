export const internationalPhoneFormat = (input: string) => {
  // Remove all non-digit characters from the input
  const cleanedNumber = input?.replace(/\D/g, '');

  // Ensure the cleaned number is at least 2 characters long
  if (cleanedNumber?.length < 2) {
    return cleanedNumber;
  }

  // Apply the desired format
  let formatted = cleanedNumber?.slice(0, 2) + ' ';
  formatted += cleanedNumber?.slice(2, 6) + '-';
  formatted += cleanedNumber?.slice(6);

  if (formatted?.endsWith('-')) {
    return (formatted = formatted?.slice(0, -1));
  } else {
    return formatted;
  }
};

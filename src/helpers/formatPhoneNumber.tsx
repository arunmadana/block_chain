//convert phone number into format-('(201) 422-2730')
export default function formatPhoneNumber(phoneNumberString: string) {
  var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
  var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return '(' + match[1] + ') ' + match[2] + ' - ' + match[3];
  }
  return null;
}

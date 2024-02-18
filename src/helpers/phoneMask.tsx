// retrieve phonenumber
const phoneMask = (number) => {
  return `(${number && number.substring(0, 3)}) ${
    number && number.slice(3, 6)
  } - ${number && number.slice(6)} `;
};

//retrieve the phoneNumber with countryCode
const phoneMaskWithCountryCode = (number) => {
  if (!number) return;
  const phoneNumber = number.split(" ");
  return `(${phoneNumber && phoneNumber.substring(0, 3)}) ${
    phoneNumber && phoneNumber.slice(3, 6)
  } - ${phoneNumber && phoneNumber.slice(6)} `;
};

export { phoneMaskWithCountryCode };
export default phoneMask;

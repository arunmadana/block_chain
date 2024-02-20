import capitalizeFirstLetter from './capitalizeFirstLetter';

export default function nameToInitials(firstName, lastName) {
  const firstNameArray =
    (firstName ? capitalizeFirstLetter(firstName) : '')?.split(' ') ?? [];
  const secondNameArray =
    (lastName ? capitalizeFirstLetter(lastName) : '')?.split(' ') ?? [];
  return `${firstNameArray[0]?.charAt(0)}${secondNameArray[0]?.charAt(0)}`;
}

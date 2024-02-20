import Toggle from 'react-toggle';

import './Toggle.style.scss';

const CustomToggle = ({ color = 'blue', noPointer = true, ...props }) => (
  <Toggle
    data-testid="toggle-button"
    className={`toggle-${color}  ${
      noPointer
        ? 'cursor-pointer hover:opacity-100 opacity: 0.8'
        : 'cursor-default '
    }`}
    icons={false}
    {...props}
  />
);

export default CustomToggle;

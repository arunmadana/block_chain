/**
 * This is used to store the data
 * of the Greenbox User selected
 */

// actions
const STORE_GREENBOX_USER_INFO = '@gBoxUserInfo/STORE';

const initialState = {
  id: 0,
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  permission: '',
  department: '',
  active: true,
  archived: false,
  image: ''
};

// reducer
export default function greenboxUserInfoReducer(
  state = initialState,
  { type, payload }
) {
  switch (type) {
    case STORE_GREENBOX_USER_INFO:
      return { ...state, ...payload };
    default:
      return state;
  }
}

export const storeGreenboxUserInfo = (payload) => ({
  type: STORE_GREENBOX_USER_INFO,
  payload
});

// actions
const SHOW_ACCOUNT_LOCKED_MODAL =
  'account-locked-modal/SHOW_ACCOUNT_LOCKED_MODAL';
const HIDE_ACCOUNT_LOCKED_MODAL =
  'account-locked-modal/HIDE_ACCOUNT_LOCKED_MODAL';

const initialState = {
  show: false
};

// reducer
export default function accountLockedModalReducer(
  state = initialState,
  { type }
) {
  switch (type) {
    case SHOW_ACCOUNT_LOCKED_MODAL:
      return { show: true };
    case HIDE_ACCOUNT_LOCKED_MODAL:
      return { show: false };
    default:
      return state;
  }
}

// action creators
export const showLockedAccountModal = () => ({
  type: SHOW_ACCOUNT_LOCKED_MODAL
});
export const hideLockedAccountModal = () => ({
  type: HIDE_ACCOUNT_LOCKED_MODAL
});

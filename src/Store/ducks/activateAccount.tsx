//actions
const ACTIVATE_USER = "activate-account/ACTIVATE_USER";
const RESET_ACTIVATION = "activate-account/RESET_ACTIVATION";

//initial state
const initialState = {
  name: "",
  phoneNumber: "",
  email: "",
  code: "",
};

//reducer
export default function activateUserReducer(
  state = initialState,
  { type, payload }
) {
  switch (type) {
    case ACTIVATE_USER:
      return { ...state, ...payload };
    case RESET_ACTIVATION:
      return initialState;
    default:
      return state;
  }
}

//action creators
export const setActivateUser = (data) => (dispatch, getState) => {
  dispatch({ type: ACTIVATE_USER, payload: data });
};

export const resetActivateUser = () => (dispatch) => {
  dispatch({ type: RESET_ACTIVATION });
};

import { getPreferences } from 'Services/API/MyProfile/MyProfile';

// Actions
const START_REQUEST = '/customer/me/preferences/START-REQUEST';
const REQUEST_ERROR = '/customer/me/preferences/REQUEST-ERROR';
const USER_PREFERENCES = '/customer/me/preferences/USER_PREFERENCES';

const initialState = {
  isLoading: false,
  isError: false,
  timeZone: 0,
  localCurrency: 0,
  preferredAccount: 0,
  lastUpdated: null
};

export default function userPreferencesReducer(
  state = initialState,
  { type, payload }
) {
  switch (type) {
    case START_REQUEST:
      return {
        ...state,
        isError: false,
        isLoading: true
      };
    case REQUEST_ERROR:
      return {
        ...state,
        isError: true,
        isLoading: false
      };
    case USER_PREFERENCES:
      return {
        ...state,
        isError: false,
        isLoading: false,
        lastUpdated: new Date(),
        ...payload
      };
    default:
      return state;
  }
}

// Action Creators

export const getUserPreferences = (userId) => (dispatch) => {
  dispatch({ type: START_REQUEST });
  getPreferences()
    .then((res) => {
      const { data } = res.data;
      dispatch({
        type: USER_PREFERENCES,
        payload: {
          timeZone: data?.timeZone === null ? 0 : data?.timeZone,
          localCurrency: 0,
          preferredAccount:
            data?.preferredAccount === null ? userId : data?.preferredAccount
        }
      });
    })
    .catch((err) => {
      console.error(err.response);
      dispatch({ type: REQUEST_ERROR });
    });
};

export const updateUserPreferences =
  (timeZone, localCurrency, preferredAccount) => (dispatch) => {
    dispatch({
      type: USER_PREFERENCES,
      payload: {
        timeZone,
        localCurrency,
        preferredAccount
      }
    });
  };

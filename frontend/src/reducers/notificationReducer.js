const initialState = {
  notification: '',
  timeoutId: null,
  error: false,
};

const notificationReducer = (state=initialState, action) => {
  switch (action.type) {
  case 'SET_ERROR':
    if (state.timeoutId !== null) {
      clearTimeout(state.timeoutId);
    }
    return {
      notification: action.notification,
      error: true,
      timeoutId: action.timeoutId,
    };
  case 'SET_SUCCESS':
    if (state.timeoutId !== null) {
      clearTimeout(state.timeoutId);
    }
    return {
      notification: action.notification,
      error: false,
      timeoutId: action.timeoutId,
    };
  case 'CLEAR_NOTIFICATION':
    return initialState;
  default:
    return state;
  }
};

export const setError = (message, timeout) => {
  return async dispatch => {
    dispatch({
      type: 'SET_ERROR',
      notification: message,
      timeoutId: setTimeout(() => {
        dispatch(clear());
      }, timeout * 1000),
    });
  };
};

export const setSuccess = (message, timeout) => {
  return async dispatch => {
    dispatch({
      type: 'SET_SUCCESS',
      notification: message,
      timeoutId: setTimeout(() => {
        dispatch(clear());
      }, timeout * 1000),
    });
  };
};

export const clear = () => {
  return {
    type: 'CLEAR_NOTIFICATION',
  };
};

export default notificationReducer;
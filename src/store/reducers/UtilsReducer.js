

// utilReducer.js
const initialState = {
  userDetails: null,
  organizationDetails: null,
};

const utilReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_USER_DETAILS':
      return {
        ...state,
        userDetails: action.payload,
      };
    case 'SET_ORGANIZATION_DETAILS':
      return {
        ...state,
        organizationDetails: action.payload,
      };
    default:
      return state;
  }
};

export default utilReducer;

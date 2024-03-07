// LocationReducer.js
const initialState = {
  locations: [],
};

const locationReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_LOCATIONS':
      return {
        ...state,
        locations: action.payload,
      };
    default:
      return state;
  }
};

export default locationReducer;

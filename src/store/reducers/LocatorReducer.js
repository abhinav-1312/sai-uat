// LocatorReducer.js
const initialState = {
  locators: [],
};

const locatorReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_LOCATORS':
      return {
        ...state,
        locators: action.payload,
      };
    default:
      return state;
  }
};

export default locatorReducer;
